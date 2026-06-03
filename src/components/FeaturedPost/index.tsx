import Link from 'next/link';
import { PostModel } from '@/models/post/post-model';
import { Heading } from '@/components/Heading';
import { PostImageCover } from '@/components/PostImageCover';
import { PostDate } from '@/components/PostDate';

type FeaturedPostProps = {
  post: PostModel;
};

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-20 group">
      {post.coverImageUrl && (
        <PostImageCover
          src={post.coverImageUrl}
          alt={post.title}
          slug={post.slug}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-64 md:h-full min-h-64"
          priority
        />
      )}
      <div className="flex flex-col justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Destaque
          </span>
        </div>
        <PostDate dateTime={post.createdAt} />
        <Link href={`/post/${post.slug}`}>
          <Heading level={2} className="text-gray-900 dark:text-white leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {post.title}
          </Heading>
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {post.author.charAt(0)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
          </div>
          <Link
            href={`/post/${post.slug}`}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Ler mais →
          </Link>
        </div>
      </div>
    </div>
  );
}
