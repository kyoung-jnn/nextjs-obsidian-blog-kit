import type { Metadata } from 'next';
import type { StaticImageData } from 'next/image';

import GalleryPhoto from '@/app/gallery/components/GalleryPhoto';
import GalleryVideo from '@/app/gallery/components/GalleryVideo';
import GALLERY_LIST from '@/app/gallery/database';
import { METADATA_CONFIG, OPEN_GRAPH_CONFIG } from '@/config';

export const metadata: Metadata = {
  ...METADATA_CONFIG,
  title: 'Gallery',
  alternates: { canonical: '/gallery' },
  openGraph: OPEN_GRAPH_CONFIG,
};

export default function GalleryPage() {
  return (
    <>
      {GALLERY_LIST?.map(({ type, src, alt }, index) => {
        if (type === 'image') {
          return <GalleryPhoto key={index} src={src as StaticImageData} alt={alt} />;
        }
        return <GalleryVideo key={index} src={src as string} alt={alt} />;
      })}
    </>
  );
}
