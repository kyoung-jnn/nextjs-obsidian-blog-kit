import type { MetadataRoute } from 'next';

import { SITE_CONFIG } from '@/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: SITE_CONFIG.siteUrl ? `${SITE_CONFIG.siteUrl}/sitemap.xml` : undefined,
    host: SITE_CONFIG.siteUrl || undefined,
  };
}
