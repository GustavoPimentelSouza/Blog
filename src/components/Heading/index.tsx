import clsx from 'clsx';

type Level = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = {
  level: Level;
  children: React.ReactNode;
  className?: string;
};

const sizeMap: Record<Level, string> = {
  1: 'text-3xl md:text-5xl font-bold',
  2: 'text-2xl md:text-3xl font-bold',
  3: 'text-lg md:text-xl font-semibold',
  4: 'text-base md:text-lg font-semibold',
  5: 'text-sm md:text-base font-medium',
  6: 'text-xs md:text-sm font-medium',
};

export function Heading({ level, children, className }: HeadingProps) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  return <Tag className={clsx(sizeMap[level], className)}>{children}</Tag>;
}
