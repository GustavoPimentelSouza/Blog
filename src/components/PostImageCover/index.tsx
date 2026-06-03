import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

type PostImageCoverProps = {
  src: string;
  alt: string;
  slug: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function PostImageCover({ src, alt, slug, sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw', className, priority = false }: PostImageCoverProps) {
  return (
    <Link href={`/post/${slug}`} className={clsx('relative block overflow-hidden rounded-2xl', className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover group-hover:scale-105 transition-transform duration-300" />
    </Link>
  );
}
