import { transformerCopyButton } from '@rehype-pretty/transformers';

import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { cache } from 'react';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import rehypeMermaid from '@/lib/rehypeMermaid';
import type { Post, PostMeta } from '@/types/post';
import { slugify } from '@/utils';

const POSTS_DIR = path.join(process.cwd(), 'posts');

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico)$/i;

function transformImagePaths(content: string): string {
  // ../public/images/foo.jpg → /images/foo.jpg
  content = content.replace(
    /(?:\.\.\/)+public\/images\/([^\s"')]+)/g,
    (_, filename) => `/images/${path.basename(filename)}`,
  );

  // ![alt](filename.ext) — bare filename pasted by Obsidian → /images/filename.ext
  content = content.replace(/!\[([^\]]*)\]\(([^/][^\s"')]+)\)/g, (match, alt, src) => {
    if (!IMAGE_EXTENSIONS.test(src)) return match;
    return `![${alt}](/images/${src})`;
  });

  // Obsidian image resize: ![alt|600](path) or ![alt|600x400](path) → <img> with width/height
  content = content.replace(/!\[([^|\]]*)\|(\d+(?:x\d+)?)\]\(([^)]+)\)/g, (_, alt, size, src) => {
    const [width, height] = size.split('x');
    const heightAttr = height ? ` height="${height}"` : '';
    return `<img src="${src}" alt="${alt}" width="${width}"${heightAttr} />`;
  });

  // Obsidian image resize: ![600](path) — alt is just a number
  content = content.replace(/!\[(\d+(?:x\d+)?)\]\(([^)]+)\)/g, (_, size, src) => {
    const [width, height] = size.split('x');
    const heightAttr = height ? ` height="${height}"` : '';
    return `<img src="${src}" alt="" width="${width}"${heightAttr} />`;
  });

  return content;
}

function extractDescription(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_~`]/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$[^$]+\$/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  if (!plainText) return '';
  if (plainText.length <= maxLength) return plainText;

  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > maxLength * 0.7 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

// Allow KaTeX, syntax highlighting, and heading links while blocking scripts
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'math',
    'semantics',
    'mrow',
    'mi',
    'mo',
    'mn',
    'msup',
    'msub',
    'mfrac',
    'mover',
    'munder',
    'mtable',
    'mtr',
    'mtd',
    'annotation',
    'figure',
    'figcaption',
    'button',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] || []), 'className'],
    span: [...(defaultSchema.attributes?.['span'] || []), 'className', 'style', 'dataTheme'],
    pre: [
      ...(defaultSchema.attributes?.['pre'] || []),
      'className',
      'style',
      'dataTheme',
      'dataLanguage',
    ],
    code: [
      ...(defaultSchema.attributes?.['code'] || []),
      'className',
      'style',
      'dataTheme',
      'dataLanguage',
      'dataLineNumbers',
    ],
    figure: ['className', 'dataRehypePrettyCodeFigure'],
    figcaption: ['className', 'dataRehypePrettyCodeTitle'],
    button: [...(defaultSchema.attributes?.['button'] || []), 'className', 'data', 'ariaLabel'],
    a: [...(defaultSchema.attributes?.['a'] || [])],
    img: [...(defaultSchema.attributes?.['img'] || []), 'width', 'height'],
    math: ['xmlns', 'display'],
    annotation: ['encoding'],
  },
};

// Processor is stateless — safe to reuse across calls (Shiki initializes once)
// Sanitize runs right after rehype-raw so user-authored HTML is cleaned,
// while trusted output from rehype-katex / rehype-pretty-code (including
// the <style> tag injected by transformerCopyButton) passes through untouched.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkBreaks)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeKatex)
  .use(rehypeMermaid)
  .use(rehypePrettyCode, {
    theme: {
      light: 'github-light',
      dark: 'github-dark-dimmed',
    },
    transformers: [transformerCopyButton({ visibility: 'hover', feedbackDuration: 2000 })],
  })
  .use(rehypeSlug)
  .use(rehypeStringify);

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md'));
}

interface PostFrontmatter {
  title?: string;
  date?: string | Date;
  slug?: string;
  published?: boolean;
  thumbnail?: string;
  description?: string;
  tags?: string[];
  category?: string;
}

function formatDate(date: string | Date | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0];
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return date.toString();
}

function parseFrontmatter(data: PostFrontmatter, content: string, fileName: string): PostMeta {
  const fileTitle = path.basename(fileName, '.md');
  const fileSlug = slugify(fileTitle) || fileTitle;
  return {
    title: data.title || fileTitle,
    date: formatDate(data.date),
    slug: data.slug || fileSlug,
    published: data.published === true,
    thumbnail: data.thumbnail,
    description: data.description || extractDescription(content),
    ...(data.tags && data.tags.length > 0 && { tags: data.tags }),
    ...(data.category && { category: data.category }),
  };
}

const _getAllPosts = async (): Promise<PostMeta[]> => {
  const files = getPostFiles();

  const posts = files.map((fileName) => {
    const filePath = path.join(POSTS_DIR, fileName);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return parseFrontmatter(data as PostFrontmatter, content, fileName);
  });

  const filtered = posts.filter((post) =>
    process.env.NODE_ENV === 'production' ? post.published : true,
  );

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getAllPosts = cache(_getAllPosts);

const _getPostBySlug = async (slug: string): Promise<Post | null> => {
  const files = getPostFiles();

  for (const fileName of files) {
    const filePath = path.join(POSTS_DIR, fileName);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const meta = parseFrontmatter(data as PostFrontmatter, content, fileName);

    if (meta.slug !== slug) continue;

    const transformed = transformImagePaths(content);
    const result = await processor.process(transformed);

    return {
      ...meta,
      html: String(result),
    };
  }

  return null;
};

export const getPostBySlug = cache(_getPostBySlug);

const _getAdjacentPosts = async (
  slug: string,
): Promise<{ prev: PostMeta | null; next: PostMeta | null }> => {
  const posts = await getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  // posts are sorted by date DESC: index 0 is the newest.
  // "next" (newer) is at index-1, "prev" (older) is at index+1.
  return {
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
};

export const getAdjacentPosts = cache(_getAdjacentPosts);
