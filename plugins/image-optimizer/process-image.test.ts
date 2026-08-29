import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { DEFAULT_OPTIONS } from "./types.ts";
import { makeBlurDataURL, processImage, toGeneratedPath, toPublicSrc } from "./process-image.ts";
import { cleanup, makeTempDir, writeFixturePng } from "./test-helpers.ts";

test("toPublicSrc builds a rooted posix path", () => {
    const root = path.join("/tmp", "site");
    const publicRoot = path.join(root, "public");
    const file = path.join(publicRoot, "images", "a.png");
    assert.equal(toPublicSrc(file, publicRoot), "/images/a.png");
});

test("toGeneratedPath builds target paths under outDir", () => {
    const root = path.join("/tmp", "site");
    const publicRoot = path.join(root, "public");
    const file = path.join(publicRoot, "images", "a.png");
    const { targetFile, targetSrc } = toGeneratedPath(file, publicRoot, "public/generated", root);
    assert.equal(targetFile, path.join(publicRoot, "generated", "images", "a.png"));
    assert.equal(targetSrc, "/generated/images/a.png");
});

test("oversized image is downscaled into outDir preserving aspect ratio", async () => {
    const root = await makeTempDir();
    const publicRoot = path.join(root, "public");
    const file = await writeFixturePng(path.join(publicRoot, "images"), "big.png", 4000, 2000);

    const result = await processImage(
        file,
        publicRoot,
        { ...DEFAULT_OPTIONS, maxWidth: 1000 },
        root,
    );

    assert.equal(result.originalSrc, "/images/big.png");
    assert.equal(result.src, "/generated/images/big.png");
    assert.equal(result.width, 1000);
    assert.equal(result.height, 500);

    const sourceMeta = await sharp(file).metadata();
    assert.equal(sourceMeta.width, 4000);

    const targetFile = path.join(publicRoot, "generated", "images", "big.png");
    const targetMeta = await sharp(targetFile).metadata();
    assert.equal(targetMeta.width, 1000);

    await cleanup(root);
});

test("small image keeps its dimensions in outDir", async () => {
    const root = await makeTempDir();
    const publicRoot = path.join(root, "public");
    const file = await writeFixturePng(path.join(publicRoot, "images"), "small.png", 400, 400);

    const result = await processImage(file, publicRoot, DEFAULT_OPTIONS, root);

    assert.equal(result.width, 400);
    assert.equal(result.height, 400);
    assert.equal(result.src, "/generated/images/small.png");
    await cleanup(root);
});

test("avif and webp siblings are emitted in outDir", async () => {
    const root = await makeTempDir();
    const publicRoot = path.join(root, "public");
    const file = await writeFixturePng(path.join(publicRoot, "images"), "a.png", 600, 400);

    await processImage(file, publicRoot, DEFAULT_OPTIONS, root);

    const genDir = path.join(publicRoot, "generated", "images");
    assert.ok(existsSync(path.join(genDir, "a.avif")));
    assert.ok(existsSync(path.join(genDir, "a.webp")));
    const avif = await stat(path.join(genDir, "a.avif"));
    assert.ok(avif.size > 0);
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
