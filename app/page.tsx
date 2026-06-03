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

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<SpinLoader />}>
          <PostList />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
