import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Fraunces } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/Toaster';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: {
    default: 'Meu Blog',
    template: '%s | Meu Blog',
  },
  description: 'Um blog sobre produtividade, tecnologia e desenvolvimento pessoal.',
  openGraph: {
    siteName: 'Meu Blog',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' className={`${geist.variable} ${fraunces.variable}`}>
      <body className={`${geist.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
