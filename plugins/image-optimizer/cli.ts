import path from "node:path";
import { run } from "./run.ts";
import { resolveOptions } from "./types.ts";
import { CACHE_FILE } from "./index.ts";

const root = process.cwd();
const resolved = resolveOptions(undefined);
const entries = await run(root, resolved, path.resolve(root, CACHE_FILE));
console.log(`Optimized ${entries.length} images.`);
