'use client';

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { useEffect } from 'react';
import 'photoswipe/style.css';

interface Props {
  gallery?: string;
}

function ImageViewer({ gallery = '.markdown-render' }: Props) {
  // --- Image lightbox ---
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery,
      children: 'img',
      pswpModule: () => import('photoswipe'),
      showHideAnimationType: 'zoom',
      bgOpacity: 0.85,
      arrowPrev: false,
      arrowNext: false,
      counter: false,
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 'fill',
    });

    lightbox.addFilter('domItemData', (itemData, element) => {
      const img = element as HTMLImageElement;
      const pswpSrc = img.getAttribute('data-pswp-src');
      const pswpW = Number(img.getAttribute('data-pswp-width'));
      const pswpH = Number(img.getAttribute('data-pswp-height'));
      return {
        ...itemData,
        src: pswpSrc || img.src,
        msrc: img.src,
        w: pswpW || img.naturalWidth || 1200,
        h: pswpH || img.naturalHeight || 800,
      };
    });

    lightbox.init();
    return () => lightbox.destroy();
  }, [gallery]);

  // --- Code copy button (rehype-pretty-code transformer injects button HTML, sanitize strips onclick) ---
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest('button.rehype-pretty-copy');
      if (!button) return;

      const code = button.getAttribute('data') || '';
      navigator.clipboard.writeText(code);

      button.classList.add('rehype-pretty-copied');
      setTimeout(() => button.classList.remove('rehype-pretty-copied'), 2000);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}

export default ImageViewer;
