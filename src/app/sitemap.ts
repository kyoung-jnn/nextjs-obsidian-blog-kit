import type { MetadataRoute } from 'next';

import { SITE_CONFIG } from '@/config';
import { POSTS_PER_PAGE } from '@/constants';
import { getAllPosts } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const totalPageCount = Math.ceil(posts.length / POSTS_PER_PAGE);

  const defaultSitemap: MetadataRoute.Sitemap = [
    {
      url: `${SITE_CONFIG.siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.siteUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const pageSitemap: MetadataRoute.Sitemap = Array.from({ length: totalPageCount }, (_, index) => ({
    url: `${SITE_CONFIG.siteUrl}/article/list/${index + 1}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  const postSitemap: MetadataRoute.Sitemap = posts.map(({ slug, date }) => ({
    url: `${SITE_CONFIG.siteUrl}/article/${slug}`,
    lastModified: new Date(date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...defaultSitemap, ...pageSitemap, ...postSitemap];
}
