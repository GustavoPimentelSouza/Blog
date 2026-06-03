import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 mt-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Meu Blog</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Conteúdo sobre produtividade, tecnologia e desenvolvimento pessoal.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              Navegação
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              Contato
            </p>
            <a
              href="mailto:gustavopimentel822@gmail.com"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              gustavopimentel822@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} Meu Blog. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
