import path from "node:path";
import type { Plugin } from "vite";
import { run } from "./run.ts";
import { resolveOptions } from "./types.ts";
import type { ImageOptimizerOptions } from "./types.ts";

export const CACHE_FILE = "node_modules/.cache/vite-image-optimizer/manifest.json";

export default function imageOptimizer(options?: ImageOptimizerOptions): Plugin {
    const resolved = resolveOptions(options);
    return {
        name: "image-optimizer",
        apply: resolved.dev ? undefined : "build",
        async buildStart(): Promise<void> {
            const root = process.cwd();
            const entries = await run(root, resolved, path.resolve(root, CACHE_FILE));
            this.info(`image-optimizer: ${entries.length} images in ${resolved.manifest}`);
        },
    };
}
