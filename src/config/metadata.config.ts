import type { Metadata } from 'next';
import type { Twitter } from 'next/dist/lib/metadata/types/twitter-types';

import blogConfig from '@/config/blog.config';

export const METADATA_CONFIG: Metadata = {
  robots: { index: true, follow: true },
  description: blogConfig.description,
  applicationName: blogConfig.title,

  publisher: blogConfig.author.localeName,
  creator: blogConfig.author.localeName,
  authors: [{ name: blogConfig.author.localeName, url: blogConfig.siteUrl }],
  category: 'technology',
};

export const METADATA_TWITTER_CONFIG: Twitter = {
  card: 'summary_large_image',
  site: blogConfig.author.contacts.twitter || undefined,
  creator: blogConfig.author.localeName,
};
