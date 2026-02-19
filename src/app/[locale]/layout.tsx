import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Inter } from 'next/font/google';

import Navbar from '@/layout/Navbar';

import './styles/globals.css';
const inter = Inter({ subsets: ['latin'] });

type RootLayoutProps = { children: React.ReactNode; params: { locale: string } };

export default function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body className={inter.className}>
          <ThemeProvider attribute="class">
            <div className="mx-auto max-w-6xl">
              <ReactQueryProvider>
                <Navbar />
                {children}
              </ReactQueryProvider>
            </div>
          </ThemeProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
