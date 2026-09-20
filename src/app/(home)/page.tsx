import type { Metadata } from 'next';
import { Suspense } from 'react';

import HomeArticleCardList from '@/app/(home)/components/HomeArticleCardList';
import Menu from '@/app/(home)/components/Menu';
import Profile from '@/app/(home)/components/Profile';
import { OPEN_GRAPH_CONFIG } from '@/config';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: OPEN_GRAPH_CONFIG,
};

export default function HomePage() {
  return (
    <>
      <Profile />
      <Menu />
      <Suspense
        fallback={
          <div className="mt-4 mb-4 grid gap-[10px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-4 h-[44px] animate-pulse rounded-[6px]" />
            ))}
          </div>
        }
      >
        <HomeArticleCardList />
      </Suspense>
    </>
  );
}
