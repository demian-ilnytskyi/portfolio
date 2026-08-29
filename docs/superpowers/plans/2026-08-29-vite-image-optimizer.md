# Vite Image Optimizer Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a local Vite plugin that at build time downscales oversized
`public/` raster images, emits AVIF + WebP siblings, and generates a typed
manifest of width/height/blurDataURL that components consume for `next/image`.

**Architecture:** One plugin directory `plugins/image-optimizer/` split into
pure, individually testable modules (`types.ts`, `cache.ts`, `process-image.ts`,
`manifest.ts`, `index.ts`). The Vite plugin object is a thin orchestrator
invoked from `buildStart`. Output manifest lands at `src/generated/images.ts`
and is committed so `dev`/`typegen` work without a build.

**Tech Stack:** Vite 8, sharp 0.35 (already a devDependency), TypeScript 5.8
(ESM, `"type": "module"`), Node built-in test runner (`node --test`), tsx for
running TS tests.

**Spec:** `docs/superpowers/specs/2026-08-29-vinext-image-optimizer-design.md`

## Global Constraints

- ESM only. `package.json` has `"type": "module"`. Use `import`, never
  `require`.
- All new source is TypeScript with explicit return types (repo lint style:
  `typescript-eslint`, explicit return types used throughout `src/`).
- Indentation: 4 spaces (matches existing `src/` files).
- No comments in code (user global rule).
- `sharp` and `@types/sharp` are already in `devDependencies` — do not re-add or
  change versions.
- Plugin must be **idempotent**: running the build twice must not re-compress an
  already-optimized original.
- Defaults: `maxWidth: 1920`, `quality: 80`, `formats: ["avif", "webp"]`,
  `blurWidth: 16`, `dirs: ["public/images", "public/icons"]`,
  `manifest: "src/generated/images.ts"`.
- Only these extensions are processed: `.png`, `.jpg`, `.jpeg`. `.svg`, `.ico`,
  `.avif`, `.webp` are always skipped.
- Cache location: `node_modules/.cache/vite-image-optimizer/manifest.json`.
- Test command for every task:
  `npx tsx --test plugins/image-optimizer/*.test.ts`

---

### Task 1: Project scaffolding, types, and the test harness

**Files:**

- Create: `plugins/image-optimizer/types.ts`
- Create: `plugins/image-optimizer/types.test.ts`
- Modify: `package.json` (add `test` script and `tsx` devDependency)

**Interfaces:**

- Consumes: nothing.
- Produces:
  - `interface OptimizedImage { src: string; width: number; height: number; blurDataURL: string }`
  - `interface ImageOptimizerOptions { dirs?: string[]; maxWidth?: number; quality?: number; formats?: ImageFormat[]; manifest?: string; blurWidth?: number }`
  - `type ImageFormat = "avif" | "webp"`
  - `type ResolvedOptions = Required<ImageOptimizerOptions>`
  - `const DEFAULT_OPTIONS: ResolvedOptions`
  - `function resolveOptions(options: ImageOptimizerOptions | undefined): ResolvedOptions`
  - `const SUPPORTED_EXTENSIONS: readonly string[]` —
    `[".png", ".jpg", ".jpeg"]`

- [x] **Step 1: Add the test runner dependency and script**

Run:

```bash
npm install --save-dev tsx@^4.20.0
```

Then edit `package.json`, adding to `"scripts"` right after `"check-size"`:

```json
"test": "tsx --test plugins/image-optimizer/*.test.ts"
```

- [x] **Step 2: Write the failing test**

Create `plugins/image-optimizer/types.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
    DEFAULT_OPTIONS,
    resolveOptions,
    SUPPORTED_EXTENSIONS,
} from "./types.ts";

test("resolveOptions returns defaults when given undefined", () => {
    assert.deepEqual(resolveOptions(undefined), DEFAULT_OPTIONS);
});

test("resolveOptions overrides only the provided keys", () => {
    const result = resolveOptions({ quality: 55, maxWidth: 800 });
    assert.equal(result.quality, 55);
    assert.equal(result.maxWidth, 800);
    assert.deepEqual(result.formats, DEFAULT_OPTIONS.formats);
    assert.equal(result.manifest, DEFAULT_OPTIONS.manifest);
});

test("defaults match the spec", () => {
    assert.equal(DEFAULT_OPTIONS.maxWidth, 1920);
    assert.equal(DEFAULT_OPTIONS.quality, 80);
    assert.equal(DEFAULT_OPTIONS.blurWidth, 16);
    assert.deepEqual(DEFAULT_OPTIONS.formats, ["avif", "webp"]);
    assert.deepEqual(DEFAULT_OPTIONS.dirs, ["public/images", "public/icons"]);
    assert.equal(DEFAULT_OPTIONS.manifest, "src/generated/images.ts");
});

test("supported extensions exclude svg and ico", () => {
    assert.deepEqual([...SUPPORTED_EXTENSIONS], [".png", ".jpg", ".jpeg"]);
});
```

- [x] **Step 3: Run the test to verify it fails**

Run: `npx tsx --test plugins/image-optimizer/types.test.ts` Expected: FAIL —
`Cannot find module './types.ts'`.

- [x] **Step 4: Write the implementation**

Create `plugins/image-optimizer/types.ts`:

```ts
export type ImageFormat = "avif" | "webp";

export interface OptimizedImage {
    src: string;
    width: number;
    height: number;
    blurDataURL: string;
}

export interface ImageOptimizerOptions {
    dirs?: string[];
    maxWidth?: number;
    quality?: number;
    formats?: ImageFormat[];
    manifest?: string;
    blurWidth?: number;
}

export type ResolvedOptions = Required<ImageOptimizerOptions>;

export const SUPPORTED_EXTENSIONS: readonly string[] = [
    ".png",
    ".jpg",
    ".jpeg",
];

export const DEFAULT_OPTIONS: ResolvedOptions = {
    dirs: ["public/images", "public/icons"],
    maxWidth: 1920,
    quality: 80,
    formats: ["avif", "webp"],
    manifest: "src/generated/images.ts",
    blurWidth: 16,
};

export function resolveOptions(
    options: ImageOptimizerOptions | undefined,
): ResolvedOptions {
    return { ...DEFAULT_OPTIONS, ...options };
}
```

- [x] **Step 5: Run the test to verify it passes**

Run: `npx tsx --test plugins/image-optimizer/types.test.ts` Expected: PASS — 4
tests.

- [x] **Step 6: Commit**

```bash
git add package.json package-lock.json plugins/image-optimizer/types.ts plugins/image-optimizer/types.test.ts
git commit -m "feat(images): add image optimizer option types and test harness"
```

---

### Task 2: Fixture helper for image tests

**Files:**

- Create: `plugins/image-optimizer/test-helpers.ts`
- Create: `plugins/image-optimizer/test-helpers.test.ts`

**Interfaces:**

- Consumes: nothing from earlier tasks.
- Produces:
  - `async function makeTempDir(): Promise<string>` — creates a unique dir under
    `os.tmpdir()`.
  - `async function writeFixturePng(dir: string, name: string, width: number, height: number): Promise<string>`
    — writes a solid-colour PNG, returns its absolute path.
  - `async function cleanup(dir: string): Promise<void>`

- [x] **Step 1: Write the failing test**

Create `plugins/image-optimizer/test-helpers.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import sharp from "sharp";
import { cleanup, makeTempDir, writeFixturePng } from "./test-helpers.ts";

test("writeFixturePng creates a png of the requested size", async () => {
    const dir = await makeTempDir();
    const file = await writeFixturePng(dir, "a.png", 300, 150);
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.width, 300);
    assert.equal(metadata.height, 150);
    assert.equal(metadata.format, "png");
    await cleanup(dir);
    assert.equal(existsSync(dir), false);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npx tsx --test plugins/image-optimizer/test-helpers.test.ts` Expected:
FAIL — `Cannot find module './test-helpers.ts'`.

- [x] **Step 3: Write the implementation**

Create `plugins/image-optimizer/test-helpers.ts`:

```ts
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

export async function makeTempDir(): Promise<string> {
    return await mkdtemp(path.join(tmpdir(), "img-opt-"));
}

export async function writeFixturePng(
    dir: string,
    name: string,
    width: number,
    height: number,
): Promise<string> {
    const file = path.join(dir, name);
    await sharp({
        create: {
            width,
            height,
            channels: 4,
            background: { r: 12, g: 74, b: 110, alpha: 1 },
        },
    })
        .png()
        .toFile(file);
    return file;
}

export async function cleanup(dir: string): Promise<void> {
    await rm(dir, { recursive: true, force: true });
}
```

- [x] **Step 4: Run the test to verify it passes**

Run: `npx tsx --test plugins/image-optimizer/test-helpers.test.ts` Expected:
PASS — 1 test.

- [x] **Step 5: Commit**

```bash
git add plugins/image-optimizer/test-helpers.ts plugins/image-optimizer/test-helpers.test.ts
git commit -m "test(images): add sharp fixture helpers"
```

---

### Task 3: The per-file image processor

**Files:**

- Create: `plugins/image-optimizer/process-image.ts`
- Create: `plugins/image-optimizer/process-image.test.ts`

**Interfaces:**

- Consumes: `ResolvedOptions`, `OptimizedImage`, `ImageFormat` from
  `./types.ts`.
- Produces:
  - `async function processImage(absolutePath: string, publicRoot: string, options: ResolvedOptions): Promise<OptimizedImage>`
    Resizes the original in place if wider than `options.maxWidth`, re-encodes
    it at `options.quality`, writes one sibling per entry in `options.formats`,
    computes the blur data URL, and returns the manifest entry. `src` in the
    result is the POSIX-style path relative to `publicRoot`, prefixed with `/`.
  - `async function makeBlurDataURL(absolutePath: string, blurWidth: number): Promise<string>`
  - `function toPublicSrc(absolutePath: string, publicRoot: string): string`

- [x] **Step 1: Write the failing test**

Create `plugins/image-optimizer/process-image.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { DEFAULT_OPTIONS } from "./types.ts";
import { makeBlurDataURL, processImage, toPublicSrc } from "./process-image.ts";
import { cleanup, makeTempDir, writeFixturePng } from "./test-helpers.ts";

test("toPublicSrc builds a rooted posix path", () => {
    const root = path.join("/tmp", "site", "public");
    const file = path.join(root, "images", "a.png");
    assert.equal(toPublicSrc(file, root), "/images/a.png");
});

test("oversized image is downscaled to maxWidth preserving aspect ratio", async () => {
    const root = await makeTempDir();
    const file = await writeFixturePng(root, "big.png", 4000, 2000);

    const result = await processImage(file, root, {
        ...DEFAULT_OPTIONS,
        maxWidth: 1000,
    });

    assert.equal(result.width, 1000);
    assert.equal(result.height, 500);
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.width, 1000);
    await cleanup(root);
});

test("small image keeps its dimensions", async () => {
    const root = await makeTempDir();
    const file = await writeFixturePng(root, "small.png", 400, 400);

    const result = await processImage(file, root, DEFAULT_OPTIONS);

    assert.equal(result.width, 400);
    assert.equal(result.height, 400);
    await cleanup(root);
});

test("avif and webp siblings are emitted", async () => {
    const root = await makeTempDir();
    const file = await writeFixturePng(root, "a.png", 600, 400);

    await processImage(file, root, DEFAULT_OPTIONS);

    assert.ok(existsSync(path.join(root, "a.avif")));
    assert.ok(existsSync(path.join(root, "a.webp")));
    const original = await stat(file);
    const avif = await stat(path.join(root, "a.avif"));
    assert.ok(avif.size < original.size);
    await cleanup(root);
});

test("blur data url is a small inline webp", async () => {
    const root = await makeTempDir();
    const file = await writeFixturePng(root, "a.png", 800, 600);

    const blur = await makeBlurDataURL(file, 16);

    assert.ok(blur.startsWith("data:image/webp;base64,"));
    assert.ok(blur.length < 2048);
    await cleanup(root);
});

test("result src is rooted at the public dir", async () => {
    const root = await makeTempDir();
    const file = await writeFixturePng(root, "a.png", 100, 100);

    const result = await processImage(file, root, DEFAULT_OPTIONS);

    assert.equal(result.src, "/a.png");
    await cleanup(root);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npx tsx --test plugins/image-optimizer/process-image.test.ts` Expected:
FAIL — `Cannot find module './process-image.ts'`.

- [x] **Step 3: Write the implementation**

Create `plugins/image-optimizer/process-image.ts`:

```ts
import { rename, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { ImageFormat, OptimizedImage, ResolvedOptions } from "./types.ts";

export function toPublicSrc(absolutePath: string, publicRoot: string): string {
    const relative = path.relative(publicRoot, absolutePath);
    return `/${relative.split(path.sep).join("/")}`;
}

export async function makeBlurDataURL(
    absolutePath: string,
    blurWidth: number,
): Promise<string> {
    const buffer = await sharp(absolutePath)
        .resize({ width: blurWidth })
        .webp({ quality: 40 })
        .toBuffer();
    return `data:image/webp;base64,${buffer.toString("base64")}`;
}

async function encodeSibling(
    absolutePath: string,
    format: ImageFormat,
    quality: number,
): Promise<void> {
    const target = absolutePath.replace(/\.[^.]+$/, `.${format}`);
    const pipeline = sharp(absolutePath);
    const encoded = format === "avif"
        ? pipeline.avif({ quality })
        : pipeline.webp({ quality });
    await encoded.toFile(target);
}

export async function processImage(
    absolutePath: string,
    publicRoot: string,
    options: ResolvedOptions,
): Promise<OptimizedImage> {
    const metadata = await sharp(absolutePath).metadata();
    const sourceWidth = metadata.width ?? 0;
    const sourceHeight = metadata.height ?? 0;
    const needsResize = sourceWidth > options.maxWidth;

    const width = needsResize ? options.maxWidth : sourceWidth;
    const height = needsResize
        ? Math.round((sourceHeight * options.maxWidth) / sourceWidth)
        : sourceHeight;

    const temporary = `${absolutePath}.tmp`;
    let pipeline = sharp(absolutePath);
    if (needsResize) pipeline = pipeline.resize({ width: options.maxWidth });

    const extension = path.extname(absolutePath).toLowerCase();
    const encoded = extension === ".png"
        ? pipeline.png({ quality: options.quality, compressionLevel: 9 })
        : pipeline.jpeg({ quality: options.quality, mozjpeg: true });

    await encoded.toFile(temporary);
    await unlink(absolutePath);
    await rename(temporary, absolutePath);

    for (const format of options.formats) {
        await encodeSibling(absolutePath, format, options.quality);
    }

    return {
        src: toPublicSrc(absolutePath, publicRoot),
        width,
        height,
        blurDataURL: await makeBlurDataURL(absolutePath, options.blurWidth),
    };
}
```

- [x] **Step 4: Run the test to verify it passes**

Run: `npx tsx --test plugins/image-optimizer/process-image.test.ts` Expected:
PASS — 6 tests.

- [x] **Step 5: Commit**

```bash
git add plugins/image-optimizer/process-image.ts plugins/image-optimizer/process-image.test.ts
git commit -m "feat(images): add per-file resize, re-encode and blur pipeline"
```

---

### Task 4: The idempotence cache

**Files:**

- Create: `plugins/image-optimizer/cache.ts`
- Create: `plugins/image-optimizer/cache.test.ts`

**Interfaces:**

- Consumes: `OptimizedImage` from `./types.ts`.
- Produces:
  - `interface CacheEntry { mtimeMs: number; size: number; result: OptimizedImage }`
  - `type CacheData = Record<string, CacheEntry>`
  - `async function loadCache(cacheFile: string): Promise<CacheData>` — returns
    `{}` when the file is absent or malformed.
  - `async function saveCache(cacheFile: string, data: CacheData): Promise<void>`
    — creates parent dirs.
  - `async function isFresh(absolutePath: string, entry: CacheEntry | undefined, siblings: string[]): Promise<boolean>`
    — true only when `entry` exists, `mtimeMs` and `size` match the file on
    disk, and every path in `siblings` exists.

- [x] **Step 1: Write the failing test**

Create `plugins/image-optimizer/cache.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { stat, utimes, writeFile } from "node:fs/promises";
import path from "node:path";
import { isFresh, loadCache, saveCache } from "./cache.ts";
import type { CacheEntry } from "./cache.ts";
import { cleanup, makeTempDir, writeFixturePng } from "./test-helpers.ts";

const RESULT = {
    src: "/a.png",
    width: 10,
    height: 10,
    blurDataURL: "data:image/webp;base64,AA",
};

test("loadCache returns an empty object when the file is missing", async () => {
    const dir = await makeTempDir();
    assert.deepEqual(await loadCache(path.join(dir, "none.json")), {});
    await cleanup(dir);
});

test("loadCache returns an empty object for malformed json", async () => {
    const dir = await makeTempDir();
    const file = path.join(dir, "bad.json");
    await writeFile(file, "{ not json");
    assert.deepEqual(await loadCache(file), {});
    await cleanup(dir);
});

test("saveCache then loadCache round-trips", async () => {
    const dir = await makeTempDir();
    const file = path.join(dir, "nested", "cache.json");
    const data = { "/a.png": { mtimeMs: 1, size: 2, result: RESULT } };
    await saveCache(file, data);
    assert.deepEqual(await loadCache(file), data);
    await cleanup(dir);
});

test("isFresh is false without an entry", async () => {
    const dir = await makeTempDir();
    const file = await writeFixturePng(dir, "a.png", 10, 10);
    assert.equal(await isFresh(file, undefined, []), false);
    await cleanup(dir);
});

test("isFresh is true when mtime, size and siblings all match", async () => {
    const dir = await makeTempDir();
    const file = await writeFixturePng(dir, "a.png", 10, 10);
    const sibling = path.join(dir, "a.webp");
    await writeFile(sibling, "x");
    const stats = await stat(file);
    const entry: CacheEntry = {
        mtimeMs: stats.mtimeMs,
        size: stats.size,
        result: RESULT,
    };
    assert.equal(await isFresh(file, entry, [sibling]), true);
    await cleanup(dir);
});

test("isFresh is false when a sibling is missing", async () => {
    const dir = await makeTempDir();
    const file = await writeFixturePng(dir, "a.png", 10, 10);
    const stats = await stat(file);
    const entry: CacheEntry = {
        mtimeMs: stats.mtimeMs,
        size: stats.size,
        result: RESULT,
    };
    assert.equal(await isFresh(file, entry, [path.join(dir, "a.webp")]), false);
    await cleanup(dir);
});

test("isFresh is false after the file is touched", async () => {
    const dir = await makeTempDir();
    const file = await writeFixturePng(dir, "a.png", 10, 10);
    const stats = await stat(file);
    const entry: CacheEntry = {
        mtimeMs: stats.mtimeMs,
        size: stats.size,
        result: RESULT,
    };
    const later = new Date(Date.now() + 10_000);
    await utimes(file, later, later);
    assert.equal(await isFresh(file, entry, []), false);
    await cleanup(dir);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npx tsx --test plugins/image-optimizer/cache.test.ts` Expected: FAIL —
`Cannot find module './cache.ts'`.

- [x] **Step 3: Write the implementation**

Create `plugins/image-optimizer/cache.ts`:

```ts
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { OptimizedImage } from "./types.ts";

export interface CacheEntry {
    mtimeMs: number;
    size: number;
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

export async function saveCache(
    cacheFile: string,
    data: CacheData,
): Promise<void> {
    await mkdir(path.dirname(cacheFile), { recursive: true });
    await writeFile(cacheFile, JSON.stringify(data, null, 2));
}

export async function isFresh(
    absolutePath: string,
    entry: CacheEntry | undefined,
    siblings: string[],
): Promise<boolean> {
    if (!entry) return false;
    try {
        const stats = await stat(absolutePath);
        if (stats.mtimeMs !== entry.mtimeMs || stats.size !== entry.size) {
            return false;
        }
        for (const sibling of siblings) await stat(sibling);
        return true;
    } catch {
        return false;
    }
}
```

- [x] **Step 4: Run the test to verify it passes**

Run: `npx tsx --test plugins/image-optimizer/cache.test.ts` Expected: PASS — 7
tests.

- [x] **Step 5: Commit**

```bash
git add plugins/image-optimizer/cache.ts plugins/image-optimizer/cache.test.ts
git commit -m "feat(images): add mtime-and-size cache for idempotent optimization"
```

---

### Task 5: Manifest generation

**Files:**

- Create: `plugins/image-optimizer/manifest.ts`
- Create: `plugins/image-optimizer/manifest.test.ts`

**Interfaces:**

- Consumes: `OptimizedImage` from `./types.ts`.
- Produces:
  - `function renderManifest(entries: OptimizedImage[]): string` — returns the
    full TypeScript source of the generated module. Entries are sorted by `src`
    so output is deterministic.
  - `async function writeManifest(targetPath: string, entries: OptimizedImage[]): Promise<void>`
    — creates parent dirs and writes only if the content differs (avoids
    touching mtime on no-op builds).

The generated module exports:

```ts
export interface OptimizedImage {
    src: string;
    width: number;
    height: number;
    blurDataURL: string;
}
export const optimizedImages: Record<string, OptimizedImage>;
export type OptimizedImageSrc = keyof typeof optimizedImages;
export function getImage(src: string): OptimizedImage | undefined;
export function getImageProps(
    src: string,
): {
    src: string;
    width: number;
    height: number;
    blurDataURL: string;
    placeholder: "blur";
};
```

- [x] **Step 1: Write the failing test**

Create `plugins/image-optimizer/manifest.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { renderManifest, writeManifest } from "./manifest.ts";
import { cleanup, makeTempDir } from "./test-helpers.ts";

const ENTRIES = [
    {
        src: "/images/b.png",
        width: 2,
        height: 2,
        blurDataURL: "data:image/webp;base64,BB",
    },
    {
        src: "/images/a.png",
        width: 1,
        height: 1,
        blurDataURL: "data:image/webp;base64,AA",
    },
];

test("renderManifest is sorted and contains every entry", () => {
    const source = renderManifest(ENTRIES);
    assert.ok(source.includes(`"/images/a.png"`));
    assert.ok(source.includes(`"/images/b.png"`));
    assert.ok(
        source.indexOf(`"/images/a.png"`) < source.indexOf(`"/images/b.png"`),
    );
    assert.ok(source.includes("export function getImageProps"));
    assert.ok(source.includes("export const optimizedImages"));
});

test("renderManifest output is stable across calls", () => {
    assert.equal(
        renderManifest(ENTRIES),
        renderManifest([...ENTRIES].reverse()),
    );
});

test("writeManifest creates the file and its parent directory", async () => {
    const dir = await makeTempDir();
    const target = path.join(dir, "src", "generated", "images.ts");
    await writeManifest(target, ENTRIES);
    assert.equal(await readFile(target, "utf8"), renderManifest(ENTRIES));
    await cleanup(dir);
});

test("writeManifest does not rewrite identical content", async () => {
    const dir = await makeTempDir();
    const target = path.join(dir, "images.ts");
    await writeManifest(target, ENTRIES);
    const first = await stat(target);
    await new Promise((resolve) => setTimeout(resolve, 20));
    await writeManifest(target, ENTRIES);
    const second = await stat(target);
    assert.equal(first.mtimeMs, second.mtimeMs);
    await cleanup(dir);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npx tsx --test plugins/image-optimizer/manifest.test.ts` Expected: FAIL —
`Cannot find module './manifest.ts'`.

- [x] **Step 3: Write the implementation**

Create `plugins/image-optimizer/manifest.ts`:

```ts
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { OptimizedImage } from "./types.ts";

const HEADER = `// Generated by plugins/image-optimizer. Do not edit.

export interface OptimizedImage {
    src: string;
    width: number;
    height: number;
    blurDataURL: string;
}
`;

const FOOTER = `
export type OptimizedImageSrc = keyof typeof optimizedImages;

export function getImage(src: string): OptimizedImage | undefined {
    return (optimizedImages as Record<string, OptimizedImage>)[src];
}

export function getImageProps(src: string): OptimizedImage & { placeholder: "blur" } {
    const image = getImage(src);
    if (!image) throw new Error(\`Unknown optimized image: \${src}\`);
    return { ...image, placeholder: "blur" };
}
`;

export function renderManifest(entries: OptimizedImage[]): string {
    const sorted = [...entries].sort((a, b) => a.src.localeCompare(b.src));
    const body = sorted
        .map((entry) =>
            `    ${JSON.stringify(entry.src)}: {\n` +
            `        src: ${JSON.stringify(entry.src)},\n` +
            `        width: ${entry.width},\n` +
            `        height: ${entry.height},\n` +
            `        blurDataURL: ${JSON.stringify(entry.blurDataURL)},\n` +
            `    },`
        )
        .join("\n");
    return `${HEADER}\nexport const optimizedImages = {\n${body}\n} as const satisfies Record<string, OptimizedImage>;\n${FOOTER}`;
}

export async function writeManifest(
    targetPath: string,
    entries: OptimizedImage[],
): Promise<void> {
    const source = renderManifest(entries);
    try {
        if (await readFile(targetPath, "utf8") === source) return;
    } catch {
        // file does not exist yet
    }
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, source);
}
```

- [x] **Step 4: Run the test to verify it passes**

Run: `npx tsx --test plugins/image-optimizer/manifest.test.ts` Expected: PASS —
4 tests.

- [x] **Step 5: Commit**

```bash
git add plugins/image-optimizer/manifest.ts plugins/image-optimizer/manifest.test.ts
git commit -m "feat(images): generate typed image manifest module"
```

---

### Task 6: Directory scan and the run orchestrator

**Files:**

- Create: `plugins/image-optimizer/run.ts`
- Create: `plugins/image-optimizer/run.test.ts`

**Interfaces:**

- Consumes: `resolveOptions`, `SUPPORTED_EXTENSIONS`, `ResolvedOptions`,
  `OptimizedImage` from `./types.ts`; `processImage` from `./process-image.ts`;
  `loadCache`, `saveCache`, `isFresh` from `./cache.ts`; `writeManifest` from
  `./manifest.ts`.
- Produces:
  - `async function collectImages(dirs: string[], root: string): Promise<string[]>`
    — recursive; returns absolute paths whose extension is in
    `SUPPORTED_EXTENSIONS`; missing directories are skipped silently; results
    sorted.
  - `async function run(root: string, options: ResolvedOptions, cacheFile: string): Promise<OptimizedImage[]>`
    — scans, processes uncached files, reuses cached results, writes the cache
    and the manifest, returns all entries.

Note: `publicRoot` passed to `processImage` is `path.join(root, "public")`, so
manifest `src` values come out as `/images/x.png`.

- [x] **Step 1: Write the failing test**

Create `plugins/image-optimizer/run.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_OPTIONS } from "./types.ts";
import { collectImages, run } from "./run.ts";
import { cleanup, makeTempDir, writeFixturePng } from "./test-helpers.ts";

async function makeProject(): Promise<string> {
    const root = await makeTempDir();
    await mkdir(path.join(root, "public", "images"), { recursive: true });
    await mkdir(path.join(root, "public", "icons"), { recursive: true });
    return root;
}

test("collectImages finds rasters and skips svg, ico and missing dirs", async () => {
    const root = await makeProject();
    await writeFixturePng(path.join(root, "public", "images"), "a.png", 40, 40);
    await writeFile(path.join(root, "public", "images", "b.svg"), "<svg/>");
    await writeFile(path.join(root, "public", "icons", "c.ico"), "x");

    const found = await collectImages(
        ["public/images", "public/icons", "public/missing"],
        root,
    );

    assert.deepEqual(found, [path.join(root, "public", "images", "a.png")]);
    await cleanup(root);
});

test("run writes a manifest containing a rooted src for every image", async () => {
    const root = await makeProject();
    await writeFixturePng(path.join(root, "public", "images"), "a.png", 40, 40);
    const manifest = path.join(root, "src", "generated", "images.ts");
    const cacheFile = path.join(root, ".cache", "manifest.json");

    const entries = await run(root, {
        ...DEFAULT_OPTIONS,
        manifest: "src/generated/images.ts",
    }, cacheFile);

    assert.equal(entries.length, 1);
    assert.equal(entries[0].src, "/images/a.png");
    const source = await readFile(manifest, "utf8");
    assert.ok(source.includes(`"/images/a.png"`));
    await cleanup(root);
});

test("a second run is a no-op and leaves the original byte-identical", async () => {
    const root = await makeProject();
    await writeFixturePng(path.join(root, "public", "images"), "a.png", 40, 40);
    const file = path.join(root, "public", "images", "a.png");
    const cacheFile = path.join(root, ".cache", "manifest.json");

    await run(root, DEFAULT_OPTIONS, cacheFile);
    const first = await readFile(file);
    const firstStat = await stat(file);

    await run(root, DEFAULT_OPTIONS, cacheFile);
    const second = await readFile(file);
    const secondStat = await stat(file);

    assert.ok(first.equals(second));
    assert.equal(firstStat.mtimeMs, secondStat.mtimeMs);
    await cleanup(root);
});

test("changing a source file causes reprocessing", async () => {
    const root = await makeProject();
    const dir = path.join(root, "public", "images");
    await writeFixturePng(dir, "a.png", 40, 40);
    const cacheFile = path.join(root, ".cache", "manifest.json");

    await run(root, DEFAULT_OPTIONS, cacheFile);
    await writeFixturePng(dir, "a.png", 80, 60);
    const entries = await run(root, DEFAULT_OPTIONS, cacheFile);

    assert.equal(entries[0].width, 80);
    assert.equal(entries[0].height, 60);
    await cleanup(root);
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npx tsx --test plugins/image-optimizer/run.test.ts` Expected: FAIL —
`Cannot find module './run.ts'`.

- [x] **Step 3: Write the implementation**

Create `plugins/image-optimizer/run.ts`:

```ts
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { isFresh, loadCache, saveCache } from "./cache.ts";
import type { CacheData } from "./cache.ts";
import { writeManifest } from "./manifest.ts";
import { processImage } from "./process-image.ts";
import { SUPPORTED_EXTENSIONS } from "./types.ts";
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
        if (
            SUPPORTED_EXTENSIONS.includes(path.extname(item.name).toLowerCase())
        ) {
            found.push(full);
        }
    }
}

export async function collectImages(
    dirs: string[],
    root: string,
): Promise<string[]> {
    const found: string[] = [];
    for (const dir of dirs) await walk(path.resolve(root, dir), found);
    return found.sort();
}

function siblingPaths(
    absolutePath: string,
    options: ResolvedOptions,
): string[] {
    return options.formats.map((format) =>
        absolutePath.replace(/\.[^.]+$/, `.${format}`)
    );
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
        if (await isFresh(file, cached, siblingPaths(file, options))) {
            next[key] = cached;
            entries.push(cached.result);
            continue;
        }
        const result = await processImage(file, publicRoot, options);
        const stats = await stat(file);
        next[key] = { mtimeMs: stats.mtimeMs, size: stats.size, result };
        entries.push(result);
    }

    await saveCache(cacheFile, next);
    await writeManifest(path.resolve(root, options.manifest), entries);
    return entries;
}
```

- [x] **Step 4: Run the test to verify it passes**

Run: `npx tsx --test plugins/image-optimizer/run.test.ts` Expected: PASS — 4
tests.

- [x] **Step 5: Run the whole suite**

Run: `npm test` Expected: PASS — all tests from Tasks 1–6.

- [x] **Step 6: Commit**

```bash
git add plugins/image-optimizer/run.ts plugins/image-optimizer/run.test.ts
git commit -m "feat(images): add directory scan and cached run orchestrator"
```

---

### Task 7: The Vite plugin wrapper and config wiring

**Files:**

- Create: `plugins/image-optimizer/index.ts`
- Create: `plugins/image-optimizer/index.test.ts`
- Modify: `vite.config.ts`
- Modify: `.gitignore` (ensure `node_modules/.cache` is covered — it is, via
  `node_modules`; verify only)

**Interfaces:**

- Consumes: `resolveOptions`, `ImageOptimizerOptions` from `./types.ts`; `run`
  from `./run.ts`.
- Produces:
  `default function imageOptimizer(options?: ImageOptimizerOptions): Plugin` — a
  Vite plugin named `"image-optimizer"` with `apply: "build"` whose `buildStart`
  calls `run(process.cwd(), resolved, CACHE_FILE)` and logs a one-line summary.
- `export const CACHE_FILE: string` —
  `"node_modules/.cache/vite-image-optimizer/manifest.json"`.

- [x] **Step 1: Write the failing test**

Create `plugins/image-optimizer/index.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import imageOptimizer, { CACHE_FILE } from "./index.ts";

test("plugin has the expected identity and only applies on build", () => {
    const plugin = imageOptimizer();
    assert.equal(plugin.name, "image-optimizer");
    assert.equal(plugin.apply, "build");
    assert.equal(typeof plugin.buildStart, "function");
});

test("cache file lives under node_modules", () => {
    assert.equal(
        CACHE_FILE,
        "node_modules/.cache/vite-image-optimizer/manifest.json",
    );
});
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npx tsx --test plugins/image-optimizer/index.test.ts` Expected: FAIL —
`Cannot find module './index.ts'`.

- [x] **Step 3: Write the implementation**

Create `plugins/image-optimizer/index.ts`:

```ts
import path from "node:path";
import type { Plugin } from "vite";
import { run } from "./run.ts";
import { resolveOptions } from "./types.ts";
import type { ImageOptimizerOptions } from "./types.ts";

export const CACHE_FILE =
    "node_modules/.cache/vite-image-optimizer/manifest.json";

export default function imageOptimizer(
    options?: ImageOptimizerOptions,
): Plugin {
    const resolved = resolveOptions(options);
    return {
        name: "image-optimizer",
        apply: "build",
        async buildStart(): Promise<void> {
            const root = process.cwd();
            const entries = await run(
                root,
                resolved,
                path.resolve(root, CACHE_FILE),
            );
            this.info(
                `image-optimizer: ${entries.length} images in ${resolved.manifest}`,
            );
        },
    };
}
```

- [x] **Step 4: Run the test to verify it passes**

Run: `npx tsx --test plugins/image-optimizer/index.test.ts` Expected: PASS — 2
tests.

- [x] **Step 5: Wire the plugin into `vite.config.ts`**

Add the import after the existing `cloudflare` import:

```ts
import imageOptimizer from "./plugins/image-optimizer/index.ts";
```

And add it as the first entry of the `plugins` array, before
`cloudflareNextIntl()`:

```ts
plugins: [
  imageOptimizer(),
  cloudflareNextIntl(),
```

- [x] **Step 6: Run the real build and inspect the output**

```bash
npm run build
ls -la public/images
head -30 src/generated/images.ts
```

Expected: `.avif` and `.webp` siblings exist for all five project PNGs and
`profile.png`; every original PNG is smaller than before;
`src/generated/images.ts` has one entry per raster image with real `width`,
`height`, and a `data:image/webp;base64,` blur string.

- [x] **Step 7: Verify idempotence**

```bash
md5 public/images/profile.png
npm run build
md5 public/images/profile.png
```

Expected: identical checksums — the second build must not touch the file.

- [x] **Step 8: Commit**

```bash
git add plugins/image-optimizer/index.ts plugins/image-optimizer/index.test.ts vite.config.ts public/images public/icons src/generated/images.ts
git commit -m "feat(images): wire image optimizer plugin into vite config"
```

---

### Task 8: Consume the manifest in components

**Files:**

- Modify: `src/shared/components/projects_card.tsx`
- Modify: `src/app/[locale]/home_components/image_part.tsx`
- Modify: `public/_headers`

**Interfaces:**

- Consumes: `getImageProps` from `@/generated/images` (Task 5's generated
  module, produced at `src/generated/images.ts`; `@` already aliases to `src` in
  `vite.config.ts`).
- Produces: nothing consumed by later tasks.

- [x] **Step 1: Replace the hardcoded dimensions in `projects_card.tsx`**

Add the import alongside the existing ones:

```ts
import { getImageProps } from "@/generated/images";
```

Replace the `<Image …/>` block (currently `width={800} height={400}`) with:

```tsx
<Image
    {...getImageProps(image)}
    alt={title}
    className="rounded-t-2xl bg-zinc-800 self-center w-full h-auto"
    sizes="(max-width: 768px) 100vw, 800px"
    fetchPriority={imagePriority ? "high" : "auto"}
    priority={imagePriority}
/>;
```

Also remove the now-unused `import type { StaticImageData } from "next/image";`
line.

- [x] **Step 2: Use the manifest in `image_part.tsx`**

Add the import:

```ts
import { getImageProps } from "@/generated/images";
```

Replace the `<Image …/>` block with:

```tsx
<Image
    {...getImageProps("/images/profile.png")}
    alt={"Profile"}
    priority
    sizes="400px"
    fetchPriority="high"
    className="rounded-full border-gray-200 dark:border-0 border-2"
/>;
```

- [x] **Step 3: Add `Vary: Accept` to the image routes in `public/_headers`**

Change the `/images/*` block to:

```
/images/*
  Cache-Control: public, max-age=31536000, immutable
  Vary: Accept
```

And the `/icons/*` block to:

```
/icons/*
  Cache-Control: public, max-age=31536000, immutable
  Vary: Accept
```

- [x] **Step 4: Typecheck and lint**

```bash
npm run check
npm run lint
```

Expected: both pass with no errors.

- [x] **Step 5: Build and smoke-test in the browser**

```bash
npm run preview
```

Open the home page and one project page. Expected: the profile image and each
project card render at their true aspect ratio, and a blurred placeholder is
visible on a throttled connection before the full image loads.

- [x] **Step 6: Commit**

```bash
git add src/shared/components/projects_card.tsx "src/app/[locale]/home_components/image_part.tsx" public/_headers
git commit -m "feat(images): consume generated image manifest for dimensions and blur"
```

---

### Task 9: Document the plugin

**Files:**

- Create: `plugins/image-optimizer/README.md`

**Interfaces:**

- Consumes: everything above.
- Produces: nothing.

- [x] **Step 1: Write the README**

Create `plugins/image-optimizer/README.md`:

````markdown
# image-optimizer

Build-time Vite plugin. Scans `public/images` and `public/icons`, downscales
oversized rasters, re-encodes them, emits `.avif` + `.webp` siblings, and
generates `src/generated/images.ts` with intrinsic dimensions and a
`blurDataURL` for every image.

## Usage

```ts
// vite.config.ts
import imageOptimizer from "./plugins/image-optimizer/index.ts";

export default defineConfig({
    plugins: [imageOptimizer()/* … */
    ],
});
```

## Options

| Option      | Default                             | Meaning                               |
| ----------- | ----------------------------------- | ------------------------------------- |
| `dirs`      | `["public/images", "public/icons"]` | Directories scanned recursively       |
| `maxWidth`  | `1920`                              | Downscale anything wider              |
| `quality`   | `80`                                | Encoder quality for all formats       |
| `formats`   | `["avif", "webp"]`                  | Sibling formats emitted               |
| `manifest`  | `"src/generated/images.ts"`         | Generated module path                 |
| `blurWidth` | `16`                                | Width of the inlined blur placeholder |

## In components

```tsx
import Image from "next/image";
import { getImageProps } from "@/generated/images";

<Image {...getImageProps("/images/profile.png")} alt="Profile" sizes="400px" />;
```

`getImageProps` throws for an unknown path, so a renamed or deleted image is
caught at runtime on the first render rather than shipping a broken `<img>`.

## Idempotence

Results are cached in `node_modules/.cache/vite-image-optimizer/manifest.json`
keyed by each file's mtime and size. A file is reprocessed only when it changes
or one of its siblings is missing, so repeated builds never re-compress an
already-compressed original.

`src/generated/images.ts` is committed so `npm run dev` and `npm run typegen`
work without first running a build.

## Tests

```bash
npm test
```
````

- [x] **Step 2: Commit**

```bash
git add plugins/image-optimizer/README.md
git commit -m "docs(images): document the image optimizer plugin"
```
