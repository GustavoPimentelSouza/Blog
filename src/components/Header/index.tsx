import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Meu Blog
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            Início
          </Link>
          <Link href="/sobre" className="hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
            Sobre
          </Link>
        </nav>
      </div>
    </header>
  );
}
