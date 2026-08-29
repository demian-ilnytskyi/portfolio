import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { OptimizedImage } from "./types.ts";

export function renderManifest(entries: OptimizedImage[]): string {
    const sorted = [...entries].sort((a, b) => (a.originalSrc ?? a.src).localeCompare(b.originalSrc ?? b.src));
    const record: Record<string, OptimizedImage> = {};
    for (const entry of sorted) {
        const key = entry.originalSrc ?? entry.src;
        record[key] = {
            originalSrc: key,
            src: entry.src,
            width: entry.width,
            height: entry.height,
            blurDataURL: entry.blurDataURL,
        };
    }
    return JSON.stringify(record, null, 2);
}

export async function writeManifest(
    targetPath: string,
    entries: OptimizedImage[],
): Promise<void> {
    const source = renderManifest(entries);
    const existing = await readFile(targetPath, "utf8").catch(() => null);
    if (existing === source) return;
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, source);
}
