import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

import blogConfig from '@/config/blog.config';

export const OPEN_GRAPH_CONFIG: OpenGraph = {
  siteName: blogConfig.title,
  title: blogConfig.title,
  description: blogConfig.description,
  images: [
    {
      url: blogConfig.siteBanner,
      width: 1200,
      height: 630,
      alt: blogConfig.title,
    },
  ],
  url: blogConfig.siteUrl,
  locale: blogConfig.locale,
  type: 'website',
};
