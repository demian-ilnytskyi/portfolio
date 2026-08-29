import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_OPTIONS, resolveOptions, SUPPORTED_EXTENSIONS } from "./types.ts";

test("resolveOptions returns defaults when given undefined", () => {
    assert.deepEqual(resolveOptions(undefined), DEFAULT_OPTIONS);
});

test("resolveOptions overrides only the provided keys", () => {
    const result = resolveOptions({ quality: 55, maxWidth: 800, dev: false });
    assert.equal(result.quality, 55);
    assert.equal(result.maxWidth, 800);
    assert.equal(result.dev, false);
    assert.deepEqual(result.formats, DEFAULT_OPTIONS.formats);
    assert.equal(result.manifest, DEFAULT_OPTIONS.manifest);
    assert.equal(result.outDir, DEFAULT_OPTIONS.outDir);
});

test("defaults match the spec", () => {
    assert.equal(DEFAULT_OPTIONS.maxWidth, 1920);
    assert.equal(DEFAULT_OPTIONS.quality, 80);
    assert.equal(DEFAULT_OPTIONS.blurWidth, 8);
    assert.equal(DEFAULT_OPTIONS.dev, true);
    assert.deepEqual(DEFAULT_OPTIONS.formats, ["avif", "webp"]);
    assert.deepEqual(DEFAULT_OPTIONS.dirs, ["public/images", "public/icons"]);
    assert.equal(DEFAULT_OPTIONS.outDir, "public/generated");
    assert.equal(DEFAULT_OPTIONS.manifest, "public/generated/images.json");
});

test("supported extensions exclude svg and ico", () => {
    assert.deepEqual([...SUPPORTED_EXTENSIONS], [".png", ".jpg", ".jpeg"]);
});
