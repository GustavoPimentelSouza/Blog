import Link from 'next/link';
import { findAllPublishedPaginatedCached, findAllPublishedByTagPaginatedCached } from '@/lib/post/queries';
import { FeaturedPost } from '@/components/FeaturedPost';
import { PostImageCover } from '@/components/PostImageCover';
import { Heading } from '@/components/Heading';
import { PostDate } from '@/components/PostDate';
import { TagChips } from '@/components/TagChips';

type Props = {
  page: number;
  tag?: string;
};

export async function PostList({ page, tag }: Props) {
  const { posts, total, totalPages } = tag
    ? await findAllPublishedByTagPaginatedCached(tag, page)
    : await findAllPublishedPaginatedCached(page);

  const [featured, ...rest] = page === 1 && !tag ? posts : [null, ...posts];

  const paginationHref = (p: number) => tag ? `/?tag=${tag}&page=${p}` : `/?page=${p}`;

  if (total === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400 dark:text-gray-600 text-lg">
          {tag ? `Nenhum post com a tag "${tag}".` : 'Nenhum post publicado ainda.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {page === 1 && !tag && featured && <FeaturedPost post={featured} />}

      {rest.length > 0 && (
        <>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {tag ? `Tag: ${tag}` : page === 1 ? 'Mais artigos' : 'Artigos'}
            </h2>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map(post => post && (
              <article key={post.id} className="flex flex-col group">
                {post.coverImageUrl && (
                  <PostImageCover
                    src={post.coverImageUrl}
                    alt={post.title}
                    slug={post.slug}
                    className="h-48 mb-4"
                  />
                )}
                <div className="flex flex-col flex-1">
                  <PostDate dateTime={post.createdAt} />
                  <Link href={`/post/${post.slug}`}>
                    <Heading level={3} className="text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </Heading>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex-1 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <TagChips tags={post.tags} className="mt-3" />
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{post.author}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-16">
          {page > 1 && (
            <Link
              href={paginationHref(page - 1)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={paginationHref(page + 1)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              Próximo →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
