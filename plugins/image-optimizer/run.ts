import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { isFresh, loadCache, saveCache } from "./cache.ts";
import type { CacheData } from "./cache.ts";
import { writeManifest } from "./manifest.ts";
import { processImage, toGeneratedPath } from "./process-image.ts";
import { SUPPORTED_EXTENSIONS, GENERATOR_VERSION } from "./types.ts";
import type { OptimizedImage, ResolvedOptions } from "./types.ts";

async function walk(directory: string, found: string[]): Promise<void> {
    let items;
    try {
        items = await readdir(directory, { withFileTypes: true });
    } catch {
        return;
    }
    for (const item of items) {
        const full = path.join(directory, item.name);
        if (item.isDirectory()) {
            await walk(full, found);
            continue;
        }
        if (SUPPORTED_EXTENSIONS.includes(path.extname(item.name).toLowerCase())) {
            found.push(full);
        }
    }
}

export async function collectImages(dirs: string[], root: string): Promise<string[]> {
    const found: string[] = [];
    for (const dir of dirs) await walk(path.resolve(root, dir), found);
    return found.sort();
}

function targetAndSiblingPaths(
    absolutePath: string,
    publicRoot: string,
    options: ResolvedOptions,
    root: string,
): string[] {
    const { targetFile } = toGeneratedPath(absolutePath, publicRoot, options.outDir, root);
    const siblings = options.formats.map((format) =>
        targetFile.replace(/\.[^.]+$/, `.${format}`)
    );
    const blurFile = targetFile.replace(/\.[^.]+$/, ".blur.webp");
    return [targetFile, ...siblings, blurFile];
}

export async function run(
    root: string,
    options: ResolvedOptions,
    cacheFile: string,
): Promise<OptimizedImage[]> {
    const publicRoot = path.join(root, "public");
    const files = await collectImages(options.dirs, root);
    const cache = await loadCache(cacheFile);
    const next: CacheData = {};
    const entries: OptimizedImage[] = [];

    for (const file of files) {
        const key = path.relative(root, file);
        const cached = cache[key];
        const targets = targetAndSiblingPaths(file, publicRoot, options, root);
        if (await isFresh(file, cached, targets)) {
            next[key] = cached;
            entries.push(cached.result);
            continue;
        }
        const result = await processImage(file, publicRoot, options, root);
        const stats = await stat(file);
        next[key] = { mtimeMs: stats.mtimeMs, size: stats.size, version: GENERATOR_VERSION, result };
        entries.push(result);
    }

    await saveCache(cacheFile, next);
    await writeManifest(path.resolve(root, options.manifest), entries);
    return entries;
}
