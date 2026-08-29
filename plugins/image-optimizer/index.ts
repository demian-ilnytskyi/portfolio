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
        enforce: "pre",
        apply: resolved.dev ? undefined : "build",
        resolveId(id: string): string | undefined {
            if (id === "next/image") {
                return path.resolve(process.cwd(), "plugins/image-optimizer/next-image.tsx");
            }
            return undefined;
        },
        async buildStart(): Promise<void> {
            const root = process.cwd();
            const entries = await run(root, resolved, path.resolve(root, CACHE_FILE));
            this.info(`image-optimizer: ${entries.length} images in ${resolved.manifest}`);
        },
    };
}
