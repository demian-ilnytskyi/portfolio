# image-optimizer

Build-time and dev Vite plugin + local runner script. Scans `public/images` and `public/icons`, downscales
oversized rasters into `public/generated`, emits `.avif` + `.webp` siblings,
and generates `public/generated/images.json` with intrinsic dimensions and
`blurDataURL` for every image.

Original images in `public/` are preserved untouched. Generated assets in
`public/generated/` are gitignored.

## Usage

```ts
// vite.config.ts
import imageOptimizer from "./plugins/image-optimizer/index.ts";

export default defineConfig({
    plugins: [
        imageOptimizer({ dev: true }),
    ],
});
```

## Local CLI

```bash
npm run optimize-images
```

## Options

| Option | Default | Meaning |
|---|---|---|
| `dirs` | `["public/images", "public/icons"]` | Directories scanned recursively |
| `outDir` | `"public/generated"` | Output folder for optimized files and siblings |
| `maxWidth` | `1920` | Downscale anything wider |
| `quality` | `80` | Encoder quality for all formats |
| `formats` | `["avif", "webp"]` | Sibling formats emitted |
| `manifest` | `"public/generated/images.json"` | Generated JSON manifest path |
| `blurWidth` | `16` | Width of the inlined blur placeholder |
| `dev` | `true` | When true, runs in dev server as well as build |

## In components

Standard Next.js `<Image />` works transparently without changing code:

```tsx
import Image from "next/image";

<Image src="/images/profile.png" alt="Profile" width={400} height={400} placeholder="blur" />
```

`placeholder="blur"` automatically receives `blurDataURL` from the generated manifest.

## Tests

```bash
npm test
```
