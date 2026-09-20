import Image, { type StaticImageData } from 'next/image';

import GalleryCaption from '@/app/gallery/components/GalleryCaption';

interface Props {
  src: StaticImageData;
  alt: string;
}

function GalleryPhoto({ src, alt }: Props) {
  return (
    <figure className="all-unset">
      <article className="relative h-[600px] w-full overflow-hidden rounded">
        <Image
          src={src}
          fill
          alt={alt}
          style={{ objectFit: 'cover' }}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </article>
      <GalleryCaption>{alt}</GalleryCaption>
    </figure>
  );
}

export default GalleryPhoto;
