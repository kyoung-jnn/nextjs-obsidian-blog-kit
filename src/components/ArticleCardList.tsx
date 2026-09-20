import Link from 'next/link';

import ArticleCard from '@/components/ArticleCard';
import type { PostMeta } from '@/types/post';

interface Props {
  posts: PostMeta[];
}

function ArticleCardList({ posts }: Props) {
  return (
    <ul className="mt-4 mb-4 grid gap-[10px]">
      {!posts.length && (
        <li className="text-gray-11 flex items-center justify-center py-16 text-sm">
          No posts found.
        </li>
      )}
      {posts.map(({ title, date, slug }, index) => {
        return (
          <li key={`${slug}-${index}`}>
            <Link href={`/article/${slug}`}>
              <ArticleCard title={title} date={date} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default ArticleCardList;
