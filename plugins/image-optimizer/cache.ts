import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { GENERATOR_VERSION } from "./types.ts";
import type { OptimizedImage } from "./types.ts";

export interface CacheEntry {
    mtimeMs: number;
    size: number;
    version: number;
    result: OptimizedImage;
}

export type CacheData = Record<string, CacheEntry>;

export async function loadCache(cacheFile: string): Promise<CacheData> {
    try {
        return JSON.parse(await readFile(cacheFile, "utf8")) as CacheData;
    } catch {
        return {};
    }
}

export async function saveCache(cacheFile: string, data: CacheData): Promise<void> {
    await mkdir(path.dirname(cacheFile), { recursive: true });
    await writeFile(cacheFile, JSON.stringify(data, null, 2));
}

export async function isFresh(
    absolutePath: string,
    entry: CacheEntry | undefined,
    siblings: string[],
): Promise<boolean> {
    if (!entry) return false;
    if (entry.version !== GENERATOR_VERSION) return false;
    try {
        const stats = await stat(absolutePath);
        if (stats.mtimeMs !== entry.mtimeMs || stats.size !== entry.size) return false;
        for (const sibling of siblings) await stat(sibling);
        return true;
    } catch {
        return false;
    }
}
