import Link from 'next/link';
import { PostModel } from '@/models/post/post-model';

type PostFormProps = {
  post?: PostModel;
  action: (formData: FormData) => Promise<void>;
};

export function PostForm({ post, action }: PostFormProps) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
        <input
          name="title"
          defaultValue={post?.title}
          required
          className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Autor</label>
        <input
          name="author"
          defaultValue={post?.author}
          required
          className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resumo</label>
        <input
          name="excerpt"
          defaultValue={post?.excerpt}
          required
          className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">URL da imagem de capa</label>
        <input
          name="coverImageUrl"
          defaultValue={post?.coverImageUrl}
          required
          className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo</label>
        <textarea
          name="content"
          defaultValue={post?.content}
          required
          rows={12}
          className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          value="true"
          defaultChecked={post?.published}
          id="published"
          className="w-4 h-4 accent-blue-600"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Publicar
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Salvar
        </button>
        <Link
          href="/admin"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-2 transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
