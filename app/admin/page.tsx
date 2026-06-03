import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { findAllPostsCached } from '@/lib/post/queries';
import { togglePublishAction } from '@/actions/post-actions';
import { DeletePostButton } from '@/components/DeletePostButton';

export default async function AdminPage() {
  const session = await auth();
  const posts = await findAllPostsCached();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">{session?.user?.email}</span>
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/admin/login' });
          }}>
            <button type="submit" className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
              Sair
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h2>
          <Link
            href="/admin/posts/novo"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Novo post
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Por {post.author}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <form action={async () => {
                  'use server';
                  await togglePublishAction(post.id, !post.published);
                }}>
                  <button
                    type="submit"
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                      post.published
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {post.published ? 'Publicado' : 'Rascunho'}
                  </button>
                </form>

                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Editar
                </Link>

                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
