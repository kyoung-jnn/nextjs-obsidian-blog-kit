'use client';

import { useEffect } from 'react';

import { useTheme } from 'next-themes';

import { getMermaidTheme } from '@/lib/mermaidTheme';

function MermaidRenderer() {
  const { theme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function renderDiagrams() {
      const { default: mermaid } = await import('mermaid');
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        ...getMermaidTheme(theme),
      });

      const diagrams = document.querySelectorAll<HTMLPreElement>('.markdown-render pre.mermaid');

      for (const diagram of diagrams) {
        if (cancelled) return;

        const source = diagram.dataset.mermaidSource ?? diagram.textContent ?? '';
        diagram.dataset.mermaidSource = source;
        diagram.textContent = source;
        diagram.removeAttribute('data-processed');

        await mermaid.run({ nodes: [diagram], suppressErrors: true });
      }
    }

    void renderDiagrams();

    return () => {
      cancelled = true;
    };
  }, [theme]);

  return null;
}

export default MermaidRenderer;
