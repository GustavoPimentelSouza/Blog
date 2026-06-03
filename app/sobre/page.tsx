import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Saiba mais sobre o Meu Blog.',
};

const topics = [
  { emoji: '⚡', label: 'Produtividade', desc: 'Rotinas, hábitos e métodos para render mais no dia a dia.' },
  { emoji: '🧠', label: 'Saúde Mental', desc: 'Equilíbrio, foco e bem-estar na vida moderna.' },
  { emoji: '💻', label: 'Tecnologia', desc: 'Como a tecnologia impacta nosso trabalho e vida.' },
  { emoji: '✍️', label: 'Carreira', desc: 'Escrita, comunicação e crescimento profissional.' },
  { emoji: '🌿', label: 'Estilo de Vida', desc: 'Organização, criatividade e qualidade de vida.' },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Sobre o Blog
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
            Um espaço para compartilhar ideias, reflexões e aprendizados sobre produtividade,
            tecnologia e desenvolvimento pessoal.
          </p>
        </div>

        <div className="prose prose-lg mb-12">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            O <strong className="text-gray-900 dark:text-white">Meu Blog</strong> nasceu da vontade
            de reunir conteúdos práticos e reflexivos sobre os temas que mais impactam nossa
            vida cotidiana — do trabalho à criatividade, da tecnologia ao silêncio.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Aqui você encontra artigos escritos com cuidado, pensados para quem quer crescer
            sem abrir mão do equilíbrio.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            O que você vai encontrar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map(topic => (
              <div
                key={topic.label}
                className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{topic.emoji}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{topic.label}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contato</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Tem uma sugestão de pauta ou quer trocar uma ideia? Fale comigo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:gustavopimentel822@gmail.com"
              className="flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium px-5 py-3 rounded-xl transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              gustavopimentel822@gmail.com
            </a>
            <Link
              href="/"
              className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium px-5 py-3 rounded-xl transition-colors text-sm"
            >
              ← Ver os posts
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
