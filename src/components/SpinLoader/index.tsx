import clsx from 'clsx';

type SpinLoaderProps = {
  className?: string;
};

export function SpinLoader({ className = '' }: SpinLoaderProps) {
  const classes = clsx('flex', 'items-center', 'justify-center', 'py-12', className);

  return (
    <div className={classes}>
      <div className="animate-spin">
        <div className="h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    </div>
  );
}
