import { test } from "node:test";
import assert from "node:assert/strict";
import imageOptimizer, { CACHE_FILE } from "./index.ts";

test("plugin applies in all modes when dev is true", () => {
    const plugin = imageOptimizer({ dev: true });
    assert.equal(plugin.name, "image-optimizer");
    assert.equal(plugin.apply, undefined);
    assert.equal(typeof plugin.buildStart, "function");
});

test("plugin only applies on build when dev is false", () => {
    const plugin = imageOptimizer({ dev: false });
    assert.equal(plugin.name, "image-optimizer");
    assert.equal(plugin.apply, "build");
});

test("cache file lives under node_modules", () => {
    assert.equal(CACHE_FILE, "node_modules/.cache/vite-image-optimizer/manifest.json");
});
