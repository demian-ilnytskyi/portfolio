import path from "node:path";
import type { Plugin } from "vite";
import { run } from "./run.ts";
import { resolveOptions } from "./types.ts";
import type { ImageOptimizerOptions } from "./types.ts";

const SHIM_ID = "virtual:image-optimizer-next-image";
const SHIM_PATH = "plugins/image-optimizer/next-image.tsx";

export const CACHE_FILE = "node_modules/.cache/vite-image-optimizer/manifest.json";

export default function imageOptimizer(options?: ImageOptimizerOptions): Plugin {
    const resolved = resolveOptions(options);
    return {
        name: "image-optimizer",
        enforce: "pre",
        apply: resolved.dev ? undefined : "build",
        resolveId(id: string): string | undefined {
            if (id === SHIM_ID) return path.resolve(process.cwd(), SHIM_PATH);
            return undefined;
        },
        transform(code: string, id: string): { code: string; map: null } | undefined {
            if (id.includes("node_modules")) return undefined;
            if (id === path.resolve(process.cwd(), SHIM_PATH)) return undefined;
            if (!/from\s*["']next\/image["']/.test(code)) return undefined;
            const next = code.replace(
                /(import\s+(?!type\s)[^;]*?from\s*)(["'])next\/image\2/g,
                `$1$2${SHIM_ID}$2`,
            );
            return next === code ? undefined : { code: next, map: null };
        },
        async buildStart(): Promise<void> {
            const root = process.cwd();
            const entries = await run(root, resolved, path.resolve(root, CACHE_FILE));
            this.info(`image-optimizer: ${entries.length} images in ${resolved.manifest}`);
        },
    };
}
