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
}

const images = manifest as Record<string, ManifestEntry>;

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
                blurDataURL = entry.blurDataURL;
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
