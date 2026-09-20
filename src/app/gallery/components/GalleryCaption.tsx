import type { PropsWithChildren } from 'react';

function GalleryCaption({ children }: PropsWithChildren) {
  return <figcaption className="mt-1.5 text-xs italic">{children}</figcaption>;
}

export default GalleryCaption;
