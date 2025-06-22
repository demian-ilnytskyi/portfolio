import AppLinks from '@/shared/constants/variables/links';
import projects from '@/shared/constants/variables/projects';
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
  const customRoutes: CustomRouteProps[] = [
    {
      changeFrequency: 'monthly',
      priority: 1,
      alternates: generateAlternates(),
    },
    {
      link: AppLinks.projectsPage,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: generateAlternates(AppLinks.projectsPage),
    },
  ];


  for (const project of projects) {
    const link = `${AppLinks.projectsPage}/${project.name}`;
    customRoutes.push({
      link: link,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: generateAlternates(link),
    });
  }

  const routes = KTextConstants.locales.reduce(
    (currentValue: MetadataRoute.Sitemap, locale: string) => {
      const localeValue = locale === KTextConstants.defaultLocale ? '' : `/${locale}`;

      const localeUrl = KTextConstants.baseUrl + localeValue;
      for (const customRoute of customRoutes) {
        currentValue.push({
          ...customRoute,
          url: localeUrl + (customRoute.link ?? ''),
          lastModified: date,
        });
      }
      return currentValue;
    },
    []
  )

  routes.sort((a, b) => a.url.localeCompare(b.url));

  return routes;
}