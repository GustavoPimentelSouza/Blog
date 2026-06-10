'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { toast } from 'react-toastify';
import { UPLOAD_ALLOWED_TYPES, UPLOAD_MAX_BYTES } from '@/lib/upload-config';

type Props = {
  defaultValue?: string;
};

export function CoverImageUpload({ defaultValue }: Props) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!UPLOAD_ALLOWED_TYPES[file.type]) {
      toast.error('Tipo não permitido. Use JPEG, PNG, WebP ou GIF.');
      return;
    }
    if (file.size > UPLOAD_MAX_BYTES) {
      toast.error(
        `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máximo: ${UPLOAD_MAX_BYTES / 1024 / 1024} MB.`,
      );
      return;
    }

    setIsUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? 'Erro ao fazer upload.');
        return;
      }
      setUrl(data.url ?? '');
      toast.success('Imagem enviada com sucesso!');
    } catch {
      toast.error('Falha na conexão. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = Array.from(e.dataTransfer.files).find((f) => UPLOAD_ALLOWED_TYPES[f.type]);
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="coverImageUrl" value={url} />

      {url ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <div className="relative w-full h-48">
            <Image
              src={url}
              alt="Imagem de capa"
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
              unoptimized={url.startsWith('/uploads/')}
            />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-white text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Enviando...' : 'Trocar imagem'}
            </button>
            <button
              type="button"
              onClick={() => setUrl('')}
              className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={clsx(
            'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed py-10 px-6 text-center transition-colors',
            isUploading
              ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/40 hover:border-gray-400 dark:hover:border-gray-500',
          )}
        >
          {isUploading ? (
            <svg className="animate-spin text-blue-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg className="text-gray-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isUploading ? 'Enviando imagem...' : 'Arraste uma imagem aqui ou'}
            </p>
            {!isUploading && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                escolha um arquivo
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            JPEG, PNG, WebP ou GIF · máx. {UPLOAD_MAX_BYTES / 1024 / 1024} MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
