# Vite Image Optimizer Plugin — Design

**Date:** 2026-08-29
**Status:** Approved

## Goal

A Vite plugin that automatically optimizes every raster image in `public/`
at build time: downscale oversized sources, emit modern-format siblings
(AVIF + WebP), and generate `blurDataURL` placeholders plus intrinsic
width/height — so components stop hardcoding dimensions and get real blur
placeholders with zero manual work.

## Problem

- `public/images/*.png` are 0.4–3.0 MB each (6 files, ~7.6 MB total).
- Images are referenced as **string paths** (`/images/x.png`) in
  `projects.ts`, `image_part.tsx`, `sitemap.ts`, `shems.tsx` — never as ESM
  imports, so `vite-imagetools` cannot see them and `next/image` gets no
  intrinsic size or `blurDataURL`.
- `ProjectsCard` hardcodes `width={800} height={400}`, which does not match
  any real aspect ratio → layout distortion risk.
- No `placeholder="blur"` anywhere.

## Non-Goals

- Migrating image references to ESM imports.
- Touching SVG or `.ico` assets.
- Replacing `@vinext/cloudflare` `imagesOptimizer()` runtime negotiation.

## Architecture

A single local Vite plugin, `plugins/vite-image-optimizer.ts`, wired into
`vite.config.ts` `plugins` array before `vinext()`.

### Pipeline (per raster file under `public/images` and `public/icons`)

1. `sharp(file).metadata()` → intrinsic `width`, `height`, `format`.
2. If `width > maxWidth` (default **1920**), resize down preserving aspect
   ratio; otherwise keep dimensions.
3. Re-encode and overwrite the original in place at the configured quality
   (PNG → `sharp.png({ quality, compressionLevel: 9, palette: true })`,
   JPEG → `sharp.jpeg({ quality, mozjpeg: true })`).
4. Emit siblings next to the original: `<name>.avif` and `<name>.webp`.
5. Blur: resize to 16px wide, encode WebP q40, → `data:image/webp;base64,…`.

### Manifest

Writes `src/generated/images.ts` — a typed, checked-in generated module:

```ts
export interface OptimizedImage {
    src: string;
    width: number;
    height: number;
    blurDataURL: string;
}

export const optimizedImages = {
    "/images/profile.png": { src: "/images/profile.png", width: 400, height: 400, blurDataURL: "data:image/webp;base64,..." },
    // …
} as const satisfies Record<string, OptimizedImage>;

export type OptimizedImageSrc = keyof typeof optimizedImages;

export function getImage(src: string): OptimizedImage | undefined;
```

Consumers spread it:

```tsx
<Image {...getImageProps("/images/profile.png")} alt="Profile" placeholder="blur" />
```

### Caching

Per-file cache at `node_modules/.cache/vite-image-optimizer/manifest.json`,
keyed by absolute path → `{ mtimeMs, size, result }`. A file is reprocessed
only when `mtimeMs` or `size` changed, or its `.avif`/`.webp` siblings are
missing. Guarantees idempotence: re-running the build must not
re-compress an already-compressed original (which would degrade it).

Idempotence guard: after the first successful pass a marker is stored in
the cache; on a cache hit the original is **not** re-encoded, only the
manifest entry is reused.

### Dev vs Build

- `apply: "build"` for the encoding pass — dev serves originals.
- `buildStart` hook runs the pass and writes the manifest.
- Manifest is committed to git so `dev` and `typegen` work without a build.

### Serving the modern formats

`@vinext/cloudflare` `imagesOptimizer()` handles `Accept`-based negotiation
for `/_next/image` requests. The emitted `.avif`/`.webp` siblings are an
explicit, statically addressable fallback and are additionally exposed via
`public/_headers` `Vary: Accept` on `/images/*`.

## Options

```ts
imageOptimizer({
    dirs: ["public/images", "public/icons"],
    maxWidth: 1920,
    quality: 80,
    formats: ["avif", "webp"],
    manifest: "src/generated/images.ts",
    blurWidth: 16,
})
```

All optional with the defaults shown.

## Components changed

| File | Change |
|---|---|
| `src/shared/components/projects_card.tsx` | drop hardcoded `800x400`, use manifest dims + blur |
| `src/app/[locale]/home_components/image_part.tsx` | use manifest dims + blur for `profile.png` |
| `public/_headers` | add `Vary: Accept` to `/images/*` |

`sitemap.ts`, `shems.tsx`, `metadata_helper.ts` keep raw string URLs — they
are metadata, not rendered images.

## Testing

Node test runner (`node --test`) against the plugin's pure helpers, using
sharp-generated fixture images in a temp dir:

- Oversized image is downscaled to `maxWidth`; aspect ratio preserved.
- Under-size image keeps its dimensions.
- `.avif` and `.webp` siblings are produced and are smaller than the source.
- `blurDataURL` starts with `data:image/webp;base64,` and is < 2 KB.
- Manifest module is valid TS and contains one entry per input.
- Second run with unchanged mtime is a no-op (byte-identical output).
- SVG and `.ico` inputs are skipped.
