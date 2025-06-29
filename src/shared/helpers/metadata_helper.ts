import type { Metadata } from "next";
import type { Icon } from "next/dist/lib/metadata/types/metadata-types";
import KTextConstants from "../constants/variables/text_constants";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { alternatesLinks, type TranslatorReturnType } from "optimized-next-intl";

export const metadataIcons: Icon[] = [
  {
    url: "/icons/logo.png",
    sizes: "32x32",
    type: "image/png",
  },
  {
    url: "/icons/logo-76.png",
    sizes: "76x76",
    type: "image/png",
  },
  {
    url: "/icons/logo-120.png",
    sizes: "120x120",
    type: "image/png",
  },
  {
    url: "/icons/logo-152.png",
    sizes: "152x152",
    type: "image/png",
  },
  {
    url: "/icons/logo-180.png",
    sizes: "180x180",
    type: "image/png",
  },
  {
    url: "/icons/logo-192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    url: "/icons/logo-512.png",
    sizes: "512x512",
    type: "image/png",
  },
];

export function openGraph(locale: Language, imageUrl?: string): OpenGraph {
  return {
    url: KTextConstants.baseUrl,
    images: [
      {
        url: KTextConstants.baseUrl + (imageUrl ?? "/icons/logo-512.png"),
        width: 512,
        height: 512,
        alt: KTextConstants.appName,
      },
    ],
    locale: grapthLocale(locale),
    type: "website",
  };
}

function grapthLocale(locale: Language): string {
  switch (locale) {
    case 'uk':
      return 'uk_UA'
    case 'en':
      return 'en_US'
  }
}

export const twitter = {
  card: "summary_large_image",
  images: KTextConstants.baseUrl + "/icons/512.png",
};

interface MetadataHelperProps {
  t: TranslatorReturnType;
  locale: Language;
  isMain?: boolean;
  canonical?: string
  linkPart: string;
}

export default function metadataHelper({
  t,
  isMain = false,
  linkPart,
  locale,
  canonical,
}: MetadataHelperProps): Partial<Metadata> {
  return {
    title: isMain ? {
      default: t('title.default'),
      template: t('title.template'),
    } : t('title'),
    description: t('description'),
    alternates: alternatesLinks({ locale, url: KTextConstants.baseUrl, canonical, linkPart })
  }
}