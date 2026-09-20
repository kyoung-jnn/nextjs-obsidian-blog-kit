import Link from 'next/link';

import type { PostMeta } from '@/types/post';

interface Props {
  prev: PostMeta | null;
  next: PostMeta | null;
}

function PostNavigation({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Post navigation"
      className="border-gray-9 desktop:col-start-2 desktop:col-end-3 tablet:grid-cols-2 dark:border-gray-6 mt-10 grid grid-cols-1 gap-3 border-t pt-8 text-sm"
    >
      <div>
        {prev && (
          <Link
            href={`/article/${prev.slug}`}
            className="hover:bg-gray-4 dark:hover:bg-gray-4 block rounded-md p-3 transition-colors"
          >
            <div className="text-gray-9 dark:text-gray-11 mb-1 text-xs">← 이전 글</div>
            <div className="text-gray-12 line-clamp-2 font-medium">{prev.title}</div>
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            href={`/article/${next.slug}`}
            className="hover:bg-gray-4 dark:hover:bg-gray-4 block rounded-md p-3 text-right transition-colors"
          >
            <div className="text-gray-9 dark:text-gray-11 mb-1 text-xs">다음 글 →</div>
            <div className="text-gray-12 line-clamp-2 font-medium">{next.title}</div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default PostNavigation;
