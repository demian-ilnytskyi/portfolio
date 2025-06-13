import KTextConstants from '@/shared/constants/variables/text_constants';
import { languages } from '@/shared/helpers/metadata_helper';
import type { MetadataRoute } from 'next'
import type { Languages } from 'next/dist/lib/metadata/types/alternative-urls-types';

const date = KTextConstants.currentDate;

type changeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined;

type Alternates = {
  languages?: Languages<string> | undefined;
} | undefined;

function generateAlternates(link?: string) {
  return {
    languages: languages(KTextConstants.baseUrl, link),
  };
}

interface CustomRouteProps {
  link?: string;
  changeFrequency?: changeFrequency;
  priority?: number | undefined;
  images?: string[] | undefined;
  alternates?: Alternates;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // const customRoutes: CustomRouteProps[] = [
  //   {
  //     changeFrequency: 'monthly',
  //     priority: 0.8,
  //     alternates: generateAlternates(),
  //   },
  //   {
  //     link: KTextConstants.discountsLink,
  //     changeFrequency: 'daily',
  //     priority: 1,
  //     alternates: generateAlternates(KTextConstants.discountsLink),
  //   },
  //   {
  //     link: KTextConstants.feedbackLink,
  //     changeFrequency: 'yearly',
  //     priority: 0.2,
  //     alternates: generateAlternates(KTextConstants.feedbackLink),
  //   },
  //   {
  //     link: KTextConstants.mobileAppLink,
  //     changeFrequency: 'monthly',
  //     priority: 0.6,
  //     alternates: generateAlternates(KTextConstants.mobileAppLink),
  //   },
  //   {
  //     link: KTextConstants.privacyPolicyLink,
  //     changeFrequency: 'yearly',
  //     priority: 0.4,
  //     alternates: generateAlternates(KTextConstants.privacyPolicyLink),
  //   },
  // ];

  // const discounts = await discountsSitemapRepository.getAll();

  // const changeFrequency: changeFrequency = 'weekly';
  // try {
  //   for (const discount of discounts) {
  //     const imageUrl = discount.imageUrl;
  //     const escapedImageUrl = imageUrl;
  //     const discountRoute = {
  //       link: `/discounts/${discount.id}`,
  //       changeFrequency: changeFrequency,
  //       priority: 0.5,
  //       images: escapedImageUrl ? [escapedImageUrl] : undefined,
  //       alternates: generateAlternates(`/discounts/${discount.id}`),
  //     };
  //     customRoutes.push(discountRoute);
  //   }
  // } catch (e) {
  //   console.error('Add Discount Pages to sitemap Error', e);
  // }

  // const routes = KTextConstants.locales.reduce(
  //   (currentValue: MetadataRoute.Sitemap, locale: string) => {
  //     const localeValue = locale === KTextConstants.defaultLocale ? '' : `/${locale}`;

  //     const localeUrl = KTextConstants.baseUrl + localeValue;
  //     for (const customRoute of customRoutes) {
  //       currentValue.push({
  //         ...customRoute,
  //         url: localeUrl + (customRoute.link ?? ''),
  //         lastModified: date,
  //       });
  //     }
  //     return currentValue;
  //   },
  //   []
  // )

  // routes.sort((a, b) => a.url.localeCompare(b.url));

  return [];
}