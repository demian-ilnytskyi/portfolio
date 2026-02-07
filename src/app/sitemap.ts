import AppLinks from "@/shared/constants/variables/links";
import projects from "@/shared/constants/variables/projects";
import KTextConstants from "@/shared/constants/variables/text_constants";
import type { MetadataRoute } from "next";
import type { IntlSitemap } from "cloudflare-next-intl";
import { generateIntlSitemap } from "cloudflare-next-intl";

export default function sitemap(): MetadataRoute.Sitemap {
  if (KTextConstants.isBuild) return [];
  const intlSitemap: IntlSitemap[] = [
    {
      changeFrequency: "monthly",
      priority: 1,
      lastModified: KTextConstants.buildDate,
      images: [KTextConstants.profileImageUrl],
    },
    {
      link: AppLinks.projectsPage,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: KTextConstants.buildDate,
    },
  ];

  for (const project of projects) {
    const link = `${AppLinks.projectsPage}/${project.name}`;
    intlSitemap.push({
      link: link,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: KTextConstants.buildDate,
      images: [`${KTextConstants.baseUrl}/images/${project.name}.png`],
    });
  }

  return generateIntlSitemap({ intlSitemap, url: KTextConstants.baseUrl });
}
