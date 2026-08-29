import React from "react";
import VinextImage, { getImageProps as vinextGetImageProps, imageOptimizationUrl } from "vinext/shims/image";
import type { ImageProps } from "next/image";
import manifest from "../../public/generated/images.json" with { type: "json" };

interface ManifestEntry {
    originalSrc?: string;
    src?: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
}

function getImageBlurSvg(
    blurDataURL: string,
    blurWidth?: number,
    blurHeight?: number,
    objectFit?: string,
): string {
    const std = 20;
    const viewBox = blurWidth && blurHeight
        ? `viewBox='0 0 ${blurWidth * 40} ${blurHeight * 40}'`
        : "";
    const preserveAspectRatio = viewBox
        ? "none"
        : objectFit === "contain"
          ? "xMidYMid"
          : objectFit === "cover"
            ? "xMidYMid slice"
            : "none";
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' ${viewBox}><filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='${std}'/><feColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/><feFlood x='0' y='0' width='100%' height='100%'/><feComposite operator='out' in='s'/><feComposite in2='SourceGraphic'/><feGaussianBlur stdDeviation='${std}'/></filter><image width='100%' height='100%' x='0' y='0' preserveAspectRatio='${preserveAspectRatio}' style='filter: url(#b);' href='${blurDataURL}'/></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const images = (manifest as { images?: Record<string, ManifestEntry> }).images
    ?? (manifest as unknown as Record<string, ManifestEntry>);

function resolveProps(props: ImageProps): ImageProps {
    let src = props.src;
    let blurDataURL = props.blurDataURL;
    let width = props.width;
    let height = props.height;

    if (typeof src === "string") {
        const entry = images[src];
        if (entry) {
            if (entry.src) src = entry.src;
            if (!blurDataURL && props.placeholder === "blur" && entry.blurDataURL) {
                blurDataURL = getImageBlurSvg(
                    entry.blurDataURL,
                    entry.blurWidth,
                    entry.blurHeight,
                    (props.style as React.CSSProperties | undefined)?.objectFit,
                );
            }
            if (!width && !props.fill && entry.width) {
                width = entry.width;
                height = entry.height;
            }
        }
    }
    return { ...props, src, blurDataURL, width, height };
}

export default function Image(props: ImageProps): React.JSX.Element {
    const resolved = resolveProps(props);
    return <VinextImage {...resolved} />;
}

export function getImageProps(props: ImageProps): ReturnType<typeof vinextGetImageProps> {
    const resolved = resolveProps(props);
    return vinextGetImageProps(resolved);
}

export { imageOptimizationUrl };
