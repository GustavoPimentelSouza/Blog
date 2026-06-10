import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { PostList } from '@/components/PostList';
import { SpinLoader } from '@/components/SpinLoader';
import { Footer } from '@/components/Footer';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Meu Blog',
  description: 'Um blog sobre produtividade, tecnologia e desenvolvimento pessoal.',
  openGraph: {
    title: 'Meu Blog',
    description: 'Um blog sobre produtividade, tecnologia e desenvolvimento pessoal.',
    type: 'website',
  },
};

type Props = {
  searchParams: Promise<{ page?: string; tag?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { page: pageParam, tag } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {tag && (
          <div className="flex items-center gap-3 mb-8">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Filtrando por tag:
            </span>
            <span className="text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
              {tag}
            </span>
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              × limpar filtro
            </a>
          </div>
        )}
        <Suspense fallback={<SpinLoader />}>
          <PostList page={page} tag={tag} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
