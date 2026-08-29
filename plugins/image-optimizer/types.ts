export type ImageFormat = "avif" | "webp";

export interface OptimizedImage {
    originalSrc: string;
    src: string;
    width: number;
    height: number;
    blurDataURL: string;
}

export interface ImageOptimizerOptions {
    dirs?: string[];
    outDir?: string;
    maxWidth?: number;
    quality?: number;
    formats?: ImageFormat[];
    manifest?: string;
    blurWidth?: number;
    dev?: boolean;
}

export type ResolvedOptions = Required<ImageOptimizerOptions>;

export const SUPPORTED_EXTENSIONS: readonly string[] = [".png", ".jpg", ".jpeg"];

export const DEFAULT_OPTIONS: ResolvedOptions = {
    dirs: ["public/images", "public/icons"],
    outDir: "public/generated",
    maxWidth: 1920,
    quality: 80,
    formats: ["avif", "webp"],
    manifest: "public/generated/images.json",
    blurWidth: 16,
    dev: true,
};

export function resolveOptions(
    options: ImageOptimizerOptions | undefined,
): ResolvedOptions {
    return { ...DEFAULT_OPTIONS, ...options };
}
