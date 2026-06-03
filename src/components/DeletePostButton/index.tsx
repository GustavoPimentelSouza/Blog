'use client';

import { deletePostAction } from '@/actions/post-actions';

type DeletePostButtonProps = {
  id: string;
  title: string;
};

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(`Tem certeza que deseja deletar "${title}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) return;
    await deletePostAction(id);
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
    >
      Deletar
    </button>
  );
}
