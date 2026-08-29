import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
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

test("run writes a manifest and emits optimized images in public/generated", async () => {
    const root = await makeProject();
    await writeFixturePng(path.join(root, "public", "images"), "a.png", 40, 40);
    const manifest = path.join(root, "public", "generated", "images.json");
    const cacheFile = path.join(root, ".cache", "manifest.json");

    const entries = await run(root, { ...DEFAULT_OPTIONS, manifest: "public/generated/images.json" }, cacheFile);

    assert.equal(entries.length, 1);
    assert.equal(entries[0].originalSrc, "/images/a.png");
    assert.equal(entries[0].src, "/generated/images/a.png");

    const genFile = path.join(root, "public", "generated", "images", "a.png");
    assert.ok(existsSync(genFile));
    assert.ok(existsSync(path.join(root, "public", "generated", "images", "a.avif")));
    assert.ok(existsSync(path.join(root, "public", "generated", "images", "a.webp")));

    const source = await readFile(manifest, "utf8");
    const parsed = JSON.parse(source);
    assert.ok(parsed["/images/a.png"]);
    assert.equal(parsed["/images/a.png"].src, "/generated/images/a.png");
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

test("changing a source file causes reprocessing in outDir", async () => {
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
