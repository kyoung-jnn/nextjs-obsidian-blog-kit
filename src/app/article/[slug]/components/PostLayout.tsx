import Image from 'next/image';
import type { PropsWithChildren } from 'react';

import PostActions from '@/app/article/[slug]/components/PostActions';
import PostFooter from '@/app/article/[slug]/components/PostFooter';
import TOC from '@/app/article/[slug]/components/TOC';
import Sidebar from '@/components/Sidebar';
import { dateToStringWithDash } from '@/utils';

interface Props {
  title: string;
  date: string;
  thumbnail?: string;
}

function PostLayout({ title, date, thumbnail, children }: PropsWithChildren<Props>) {
  const updatedAt = dateToStringWithDash(date);

  return (
    <div className="desktop:grid desktop:grid-cols-[192px_640px_192px] desktop:items-start desktop:justify-center desktop:max-w-none desktop:px-0 relative mx-auto mt-[60px] flex w-full max-w-[664px] flex-col gap-2.5 px-3">
      {/* TOC sidebar */}
      <Sidebar>
        <TOC />
        <PostActions />
      </Sidebar>

      {/* post content */}
      <div className="desktop:col-start-2 desktop:col-end-3 animate-[fade-up_0.5s_forwards]">
        <header className="mb-5 text-left">
          <h1 className="text-[30px] font-bold">{title}</h1>
          <time dateTime={updatedAt} className="text-gray-9 dark:text-gray-11 block text-base">
            {updatedAt}
          </time>
          {thumbnail && (
            <figure className="relative m-0 mt-2.5 aspect-video w-full overflow-hidden rounded-lg">
              <Image src={thumbnail} alt="post thumbnail" fill priority className="object-cover" />
            </figure>
          )}
        </header>
        {children}
      </div>

      {/* post footer */}
      <PostFooter />
    </div>
  );
}

export default PostLayout;
