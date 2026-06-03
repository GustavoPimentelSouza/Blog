import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { findAllPublishedPostsCached, findPostBySlugCached } from '@/lib/post/queries';
import { Header } from '@/components/Header';
import { Heading } from '@/components/Heading';
import { PostDate } from '@/components/PostDate';
import { ShareButtons } from '@/components/ShareButtons';
import { Footer } from '@/components/Footer';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await findAllPublishedPostsCached();
  return posts.map(post => ({ slug: post.slug }));
}

type PostSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PostSlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await findPostBySlugCached(slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.createdAt,
        authors: [post.author],
        images: post.coverImageUrl
          ? [{ url: post.coverImageUrl, alt: post.title }]
          : [],
      },
    };
  } catch {
    return { title: 'Post não encontrado' };
  }
}

export default async function PostSlugPage({ params }: PostSlugPageProps) {
  const { slug } = await params;

  let post;

  try {
    post = await findPostBySlugCached(slug);
  } catch {
    post = undefined;
  }

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-16">
        {post.coverImageUrl && (
          <div className="relative w-full h-64 md:h-[480px] rounded-2xl overflow-hidden mb-10">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <Heading level={1} className="text-gray-900 dark:text-white mt-2 mb-6 leading-tight">
          {post.title}
        </Heading>

        <div className="flex items-center gap-3 mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {post.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</p>
            <PostDate dateTime={post.createdAt} />
          </div>
        </div>

        <div className="text-gray-700 dark:text-gray-300 text-lg leading-[1.9] whitespace-pre-line">
          {post.content}
        </div>

        <ShareButtons
          title={post.title}
          url={`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'}/post/${post.slug}`}
        />
      </main>
      <Footer />
    </div>
  );
}
