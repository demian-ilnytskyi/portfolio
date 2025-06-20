import type { Metadata } from "next";
import type { Icon } from "next/dist/lib/metadata/types/metadata-types";
import KTextConstants from "../constants/variables/text_constants";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import type { TranslatorReturnType } from "../localization/server";

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

export function openGraph(locale: Language): OpenGraph {
  return {
    url: KTextConstants.baseUrl,
    images: [
      {
        url: KTextConstants.baseUrl + "/icons/logo-512.png",
        width: 512,
        height: 512,
        alt: "Demian Portfolio",
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

export function languages(link: string, linkPart?: string): Record<string, string> {
  try {
    return KTextConstants.locales.reduce(
      (acc: Record<string, string>, locale: Language) => {
        const localeValue = locale === KTextConstants.defaultLocale ? '' : `/${locale}`;
        acc[locale] = link + localeValue + (linkPart ?? '');
        return acc;
      },
      { 'x-default': link + (linkPart ?? '') }
    );
  } catch (e) {
    console.error(`Language Helper error for Metadata, link: ${link}, linkPart: ${linkPart}`, e);
    return {};
  }
}

interface MetadataHelperProps {
  t: TranslatorReturnType;
  locale: Language;
  isMain?: boolean;
  canonical?: string
  linkPart: string;
  setCanonical?: boolean;
}

export default function metadataHelper({
  t,
  isMain = false,
  linkPart,
  locale,
  canonical,
  setCanonical = true,
}: MetadataHelperProps): Partial<Metadata> {
  return {
    title: isMain ? {
      default: t('title.default'),
      template: t('title.template'),
    } : t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === KTextConstants.defaultLocale && setCanonical ? KTextConstants.baseUrl + linkPart : canonical,
      languages: languages(KTextConstants.baseUrl),
    }
  }
}