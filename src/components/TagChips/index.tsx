import Link from 'next/link';
import { TagModel } from '@/models/post/post-model';

type TagChipsProps = {
  tags: TagModel[];
  className?: string;
};

export function TagChips({ tags, className = '' }: TagChipsProps) {
  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map(tag => (
        <Link
          key={tag.slug}
          href={`/?tag=${tag.slug}`}
          className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
