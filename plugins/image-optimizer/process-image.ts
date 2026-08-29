import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { ImageFormat, OptimizedImage, ResolvedOptions } from "./types.ts";

export function toPublicSrc(absolutePath: string, publicRoot: string): string {
    const relative = path.relative(publicRoot, absolutePath);
    return `/${relative.split(path.sep).join("/")}`;
}

export function toGeneratedPath(
    absolutePath: string,
    publicRoot: string,
    outDir: string,
    root: string,
): { targetFile: string; targetSrc: string } {
    const relative = path.relative(publicRoot, absolutePath);
    const resolvedOutDir = path.resolve(root, outDir);
    const targetFile = path.join(resolvedOutDir, relative);
    const outDirRelativePublic = path.relative(publicRoot, resolvedOutDir);
    const targetSrc = `/${path.join(outDirRelativePublic, relative).split(path.sep).join("/")}`;
    return { targetFile, targetSrc };
}

export async function makeBlurDataURL(
    targetFile: string,
    blurWidth: number,
): Promise<{ blurDataURL: string; blurWidth: number; blurHeight: number }> {
    const blurFile = targetFile.replace(/\.[^.]+$/, ".blur.webp");
    const { data: buffer, info } = await sharp(targetFile)
        .resize({ width: blurWidth, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer({ resolveWithObject: true });
    await sharp(buffer).toFile(blurFile);
    return {
        blurDataURL: `data:image/webp;base64,${buffer.toString("base64")}`,
        blurWidth: info.width,
        blurHeight: info.height,
    };
}

async function encodeSibling(
    targetFile: string,
    sourcePath: string,
    format: ImageFormat,
    quality: number,
    maxWidth: number,
    needsResize: boolean,
): Promise<void> {
    const target = targetFile.replace(/\.[^.]+$/, `.${format}`);
    let pipeline = sharp(sourcePath);
    if (needsResize) pipeline = pipeline.resize({ width: maxWidth });
    const encoded = format === "avif"
        ? pipeline.avif({ quality })
        : pipeline.webp({ quality });
    await encoded.toFile(target);
}

export async function processImage(
    absolutePath: string,
    publicRoot: string,
    options: ResolvedOptions,
    root: string = path.dirname(publicRoot),
): Promise<OptimizedImage> {
    const metadata = await sharp(absolutePath).metadata();
    const sourceWidth = metadata.width ?? 0;
    const sourceHeight = metadata.height ?? 0;
    const needsResize = sourceWidth > options.maxWidth;

    const width = needsResize ? options.maxWidth : sourceWidth;
    const height = needsResize
        ? Math.round((sourceHeight * options.maxWidth) / sourceWidth)
        : sourceHeight;

    const { targetFile, targetSrc } = toGeneratedPath(
        absolutePath,
        publicRoot,
        options.outDir,
        root,
    );

    await mkdir(path.dirname(targetFile), { recursive: true });

    let pipeline = sharp(absolutePath);
    if (needsResize) pipeline = pipeline.resize({ width: options.maxWidth });

    const extension = path.extname(absolutePath).toLowerCase();
    const encoded = extension === ".png"
        ? pipeline.png({ quality: options.quality, compressionLevel: 9 })
        : pipeline.jpeg({ quality: options.quality, mozjpeg: true });

    await encoded.toFile(targetFile);

    for (const format of options.formats) {
        await encodeSibling(
            targetFile,
            absolutePath,
            format,
            options.quality,
            options.maxWidth,
            needsResize,
        );
    }

    return {
        originalSrc: toPublicSrc(absolutePath, publicRoot),
        src: targetSrc,
        width,
        height,
        ...(await makeBlurDataURL(targetFile, options.blurWidth)),
    };
}
