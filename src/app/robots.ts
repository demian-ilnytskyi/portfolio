import KTextConstants from '@/shared/constants/variables/text_constants'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/profile/',
    },
    sitemap: `${KTextConstants.baseUrl}/sitemap.xml`,
  }
}