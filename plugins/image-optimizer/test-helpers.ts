import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

export async function makeTempDir(): Promise<string> {
    return await mkdtemp(path.join(tmpdir(), "img-opt-"));
}

export async function writeFixturePng(
    dir: string,
    name: string,
    width: number,
    height: number,
): Promise<string> {
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, name);
    await sharp({
        create: {
            width,
            height,
            channels: 4,
            background: { r: 12, g: 74, b: 110, alpha: 1 },
        },
    })
        .png()
        .toFile(file);
    return file;
}

export async function cleanup(dir: string): Promise<void> {
    await rm(dir, { recursive: true, force: true });
}
