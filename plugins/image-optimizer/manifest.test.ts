import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { renderManifest, writeManifest } from "./manifest.ts";
import { cleanup, makeTempDir } from "./test-helpers.ts";

const ENTRIES = [
    { originalSrc: "/images/b.png", src: "/generated/images/b.png", width: 2, height: 2, blurDataURL: "data:image/webp;base64,BB" },
    { originalSrc: "/images/a.png", src: "/generated/images/a.png", width: 1, height: 1, blurDataURL: "data:image/webp;base64,AA" },
];

test("renderManifest outputs valid sorted JSON containing every entry", () => {
    const source = renderManifest(ENTRIES);
    const parsed = JSON.parse(source);
    assert.deepEqual(Object.keys(parsed), ["/images/a.png", "/images/b.png"]);
    assert.equal(parsed["/images/a.png"].src, "/generated/images/a.png");
    assert.equal(parsed["/images/b.png"].src, "/generated/images/b.png");
});

test("renderManifest output is stable across calls", () => {
    assert.equal(renderManifest(ENTRIES), renderManifest([...ENTRIES].reverse()));
});

test("writeManifest creates the JSON file and its parent directory", async () => {
    const dir = await makeTempDir();
    const target = path.join(dir, "public", "generated", "images.json");
    await writeManifest(target, ENTRIES);
    assert.equal(await readFile(target, "utf8"), renderManifest(ENTRIES));
    await cleanup(dir);
});

test("writeManifest does not rewrite identical content", async () => {
    const dir = await makeTempDir();
    const target = path.join(dir, "images.json");
    await writeManifest(target, ENTRIES);
    const first = await stat(target);
    await new Promise((resolve) => setTimeout(resolve, 20));
    await writeManifest(target, ENTRIES);
    const second = await stat(target);
    assert.equal(first.mtimeMs, second.mtimeMs);
    await cleanup(dir);
});
