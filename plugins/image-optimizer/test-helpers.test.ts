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
