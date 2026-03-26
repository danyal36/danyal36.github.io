import type { Metadata } from 'next';
import { JetBrains_Mono, Syne } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: 'Danyal Ahmad — Full-Stack Engineer',
  description:
    'Senior Full-Stack Engineer specialising in Angular, Node.js, React, Next.js, and AI/LLM integration. Portfolio with real GitHub contribution graph from two accounts.',
  keywords: ['Danyal Ahmad', 'Full Stack Engineer', 'Angular', 'Node.js', 'React', 'AI Developer', 'danyal36'],
  openGraph: {
    title: 'Danyal Ahmad — Full-Stack Engineer',
    description: 'Senior Full-Stack Engineer — Portfolio with real GitHub contribution graph',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
