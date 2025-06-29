import AppLinks from '@/shared/constants/variables/links';
import projects from '@/shared/constants/variables/projects';
import KTextConstants from '@/shared/constants/variables/text_constants';
import type { MetadataRoute } from 'next'
import type { IntlSitemap } from 'optimized-next-intl';
import { generateIntlSitemap } from 'optimized-next-intl';

const lastModified = new Date(2025, 5, 30);

export default function sitemap(): MetadataRoute.Sitemap {
  const intlSitemap: IntlSitemap[] = [
    {
      changeFrequency: 'monthly',
      priority: 1,
      lastModified: lastModified,
      images: [KTextConstants.profileImageUrl],
    },
    {
      link: AppLinks.projectsPage,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: lastModified,
    },
  ];


  for (const project of projects) {
    const link = `${AppLinks.projectsPage}/${project.name}`;
    intlSitemap.push({
      link: link,
      changeFrequency: 'monthly',
      priority: 0.6,
      lastModified: lastModified,
      images: [`${KTextConstants.baseUrl}/images/${project.name}.png`],
    });
  }

  return generateIntlSitemap({ intlSitemap, url: KTextConstants.baseUrl });
}