import Link from 'next/link';
import { PostForm } from '@/components/PostForm';
import { createPostAction } from '@/actions/post-actions';

export default function NovoPostPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <Link href="/admin" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
          ← Voltar
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Novo post</h2>
        <PostForm action={createPostAction} />
      </main>
    </div>
  );
}
