import { test } from "node:test";
import assert from "node:assert/strict";
import { stat, utimes, writeFile } from "node:fs/promises";
import path from "node:path";
import { isFresh, loadCache, saveCache } from "./cache.ts";
import { GENERATOR_VERSION } from "./types.ts";
import type { CacheEntry } from "./cache.ts";
import { cleanup, makeTempDir, writeFixturePng } from "./test-helpers.ts";

const RESULT = { originalSrc: "/a.png", src: "/a.png", width: 10, height: 10, blurDataURL: "data:image/webp;base64,AA", blurWidth: 8, blurHeight: 8 };

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
    const data = { "/a.png": { mtimeMs: 1, size: 2, version: GENERATOR_VERSION, result: RESULT } };
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
    const entry: CacheEntry = { mtimeMs: stats.mtimeMs, size: stats.size, version: GENERATOR_VERSION, result: RESULT };
    assert.equal(await isFresh(file, entry, [sibling]), true);
    await cleanup(dir);
});

test("isFresh is false when a sibling is missing", async () => {
    const dir = await makeTempDir();
    const file = await writeFixturePng(dir, "a.png", 10, 10);
    const stats = await stat(file);
    const entry: CacheEntry = { mtimeMs: stats.mtimeMs, size: stats.size, version: GENERATOR_VERSION, result: RESULT };
    assert.equal(await isFresh(file, entry, [path.join(dir, "a.webp")]), false);
    await cleanup(dir);
});

test("isFresh is false after the file is touched", async () => {
    const dir = await makeTempDir();
    const file = await writeFixturePng(dir, "a.png", 10, 10);
    const stats = await stat(file);
    const entry: CacheEntry = { mtimeMs: stats.mtimeMs, size: stats.size, version: GENERATOR_VERSION, result: RESULT };
    const later = new Date(Date.now() + 10_000);
    await utimes(file, later, later);
    assert.equal(await isFresh(file, entry, []), false);
    await cleanup(dir);
});

test("isFresh is false when the generator version changed", async () => {
    const dir = await makeTempDir();
    const file = await writeFixturePng(dir, "a.png", 10, 10);
    const sibling = path.join(dir, "a.webp");
    await writeFile(sibling, "x");
    const stats = await stat(file);
    const entry: CacheEntry = {
        mtimeMs: stats.mtimeMs,
        size: stats.size,
        version: GENERATOR_VERSION - 1,
        result: RESULT,
    };
    assert.equal(await isFresh(file, entry, [sibling]), false);
    await cleanup(dir);
});
