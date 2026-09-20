'use client';

import Giscus, { type Repo, type Theme } from '@giscus/react';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';

import { COMMENT_CONFIG, SITE_CONFIG } from '@/config';

const isConfigured = Boolean(COMMENT_CONFIG.repoId && COMMENT_CONFIG.categoryId);

function Comment() {
  const { theme } = useTheme();
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== 'https://giscus.app') return;

    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      const errMsg: string | undefined = data?.giscus?.error;
      // "Discussion not found" is expected when this page has no comments yet;
      // giscus auto-creates the discussion on first interaction. Treat only other
      // errors (repo misconfig, network failures) as fatal.
      if (errMsg && !errMsg.toLowerCase().includes('discussion not found')) {
        setError(true);
      }
    } catch {
      // Ignore non-JSON messages from other sources
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  if (!isConfigured) return null;

  if (error) {
    return (
      <p className="text-gray-9 py-8 text-center text-sm">
        Failed to load comments. Please try again later.
      </p>
    );
  }

  const commentTheme: Theme = theme === 'dark' ? 'noborder_dark' : 'noborder_light';

  return (
    <div ref={containerRef}>
      <Giscus
        id="comments"
        repo={COMMENT_CONFIG.repo as Repo}
        repoId={COMMENT_CONFIG.repoId}
        category={COMMENT_CONFIG.category}
        categoryId={COMMENT_CONFIG.categoryId}
        term="comments"
        theme={commentTheme}
        inputPosition="bottom"
        mapping="title"
        reactionsEnabled="1"
        emitMetadata="0"
        lang={SITE_CONFIG.locale || 'en'}
        loading="lazy"
      />
    </div>
  );
}

export default Comment;
