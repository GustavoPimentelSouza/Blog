'use client';

import Link from 'next/link';
import { useState, useRef, KeyboardEvent } from 'react';
import { PostModel } from '@/models/post/post-model';
import { RichTextEditor } from '@/components/RichTextEditor';
import { CoverImageUpload } from '@/components/CoverImageUpload';

type PostFormProps = {
  post?: PostModel;
  action: (formData: FormData) => Promise<void>;
};

export function PostForm({ post, action }: PostFormProps) {
  const [content, setContent] = useState(post?.content ?? '');
  const [tags, setTags] = useState<string[]>(post?.tags.map(t => t.name) ?? []);
  const [tagInput, setTagInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(value: string) {
    const name = value.trim();
    if (!name || tags.includes(name) || tags.length >= 10) return;
    setTags(prev => [...prev, name]);
    setTagInput('');
  }

  function removeTag(name: string) {
    setTags(prev => prev.filter(t => t !== name));
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

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
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Imagem de capa</label>
        <CoverImageUpload defaultValue={post?.coverImageUrl} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
          <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">(Enter ou vírgula para adicionar)</span>
        </label>

        {tags.map(tag => (
          <input key={tag} type="hidden" name="tags" value={tag} />
        ))}

        <div
          className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-text min-h-10.5"
          onClick={() => inputRef.current?.focus()}
        >
          {tags.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                className="hover:text-blue-900 dark:hover:text-blue-100 leading-none"
                aria-label={`Remover tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => addTag(tagInput)}
            placeholder={tags.length === 0 ? 'esporte, tecnologia, viagem...' : ''}
            className="flex-1 min-w-24 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo</label>
        <input type="hidden" name="content" value={content} />
        <RichTextEditor defaultValue={post?.content} onChange={setContent} />
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
