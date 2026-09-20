import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import JsonLD from '@/app/article/[slug]/components/JsonLD';
import PostLayout from '@/app/article/[slug]/components/PostLayout';
import PostNavigation from '@/app/article/[slug]/components/PostNavigation';
import MarkdownRender from '@/components/MarkdownRender';
import { METADATA_CONFIG, METADATA_TWITTER_CONFIG, OPEN_GRAPH_CONFIG, SITE_CONFIG } from '@/config';
import { getAdjacentPosts, getAllPosts, getPostBySlug } from '@/lib/content';

type Params = { slug: string };

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const currentSlug = decodeURIComponent(params.slug);
  const post = await getPostBySlug(currentSlug);

  if (!post) return {};

  const { title, date, thumbnail, description, tags, category } = post;
  const url = `${SITE_CONFIG.siteUrl}/article/${currentSlug}`;

  return {
    ...METADATA_CONFIG,
    title,
    description,
    ...(tags && tags.length > 0 && { keywords: tags }),
    ...(category && { category }),
    alternates: { canonical: `/article/${currentSlug}` },
    openGraph: {
      ...OPEN_GRAPH_CONFIG,
      url,
      title,
      description,
      publishedTime: date,
      modifiedTime: date,
      type: 'article',
      ...(tags && tags.length > 0 && { tags }),
      ...(thumbnail && {
        images: [{ url: thumbnail, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      ...METADATA_TWITTER_CONFIG,
      title,
      description,
      ...(thumbnail && { images: [thumbnail] }),
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export default async function PostDetailPage({ params }: { params: Promise<Params> }) {
  const slug = decodeURIComponent((await params).slug);
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const { title, date, thumbnail, description, tags, category, html } = post;
  const { prev, next } = await getAdjacentPosts(slug);

  return (
    <>
      <JsonLD
        slug={slug}
        title={title}
        description={description}
        date={date}
        updatedAt={date}
        {...(thumbnail && { image: thumbnail })}
        {...(tags && tags.length > 0 && { tags })}
        {...(category && { category })}
      />
      <PostLayout title={title} date={date} thumbnail={thumbnail}>
        <MarkdownRender html={html} />
        <PostNavigation prev={prev} next={next} />
      </PostLayout>
    </>
  );
}
