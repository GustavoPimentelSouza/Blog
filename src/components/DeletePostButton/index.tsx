'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { deletePostAction } from '@/actions/post-actions';

type DeletePostButtonProps = {
  id: string;
  title: string;
};

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Tem certeza que deseja deletar "${title}"? Esta ação não pode ser desfeita.`,
    );
    if (!confirmed) return;

    try {
      await deletePostAction(id);
      router.push('/admin');
    } catch {
      toast.error('Ocorreu um erro ao deletar o post. Tente novamente.');
    }
  };

  return (
    <button
      onClick={handleDelete}
      title="Deletar post"
      className="text-red-500 hover:text-red-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}
