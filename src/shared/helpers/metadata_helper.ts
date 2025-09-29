import type { Metadata } from "next";
import type { Icon } from "next/dist/lib/metadata/types/metadata-types";
import KTextConstants from "../constants/variables/text_constants";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import type { Twitter } from "next/dist/lib/metadata/types/twitter-types";
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

export function openGraph(linkPart: string, locale: Language, imageUrl?: string): OpenGraph {
  return {
    url: getBaseUrl(locale) + linkPart,
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

export function getBaseUrl(language: Language): string {
  if (language !== KTextConstants.defaultLocale) {
    return `${KTextConstants.baseUrl}/${language}`;
  } else {
    return KTextConstants.baseUrl;
  }
}

function grapthLocale(locale: Language): string {
  switch (locale) {
    case 'uk':
      return 'uk_UA'
    case 'en':
      return 'en_US'
  }
}

export function twitter(imageUrl?: string): Twitter {
  return {
    creator: KTextConstants.owner,
    card: "summary_large_image",
    images: KTextConstants.baseUrl + (imageUrl ?? "/icons/512.png"),
  }
};

interface MetadataHelperProps {
  t: TranslatorReturnType;
  locale: Language;
  isMain?: boolean;
  canonical?: string
  linkPart: string;
  imageUrl?: string;
}

export default function metadataHelper({
  t,
  isMain = false,
  linkPart,
  locale,
  canonical,
  imageUrl,
}: MetadataHelperProps): Partial<Metadata> {
  return {
    title: isMain ? {
      default: t('title.default'),
      template: t('title.template'),
    } : t('title'),
    description: t('description'),
    alternates: alternatesLinks({ locale, url: KTextConstants.baseUrl, canonical, linkPart }),
    openGraph: openGraph(linkPart, locale, imageUrl),
  }
}