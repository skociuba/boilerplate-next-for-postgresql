import { AuthHydration } from '@/providers/AuthHydration';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { routing } from '#/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ToastContainer } from 'react-toastify';

import { CookieNotice } from '@/layout/CookieNotice';
import { Footer } from '@/layout/Footer';
import Navbar from '@/layout/Navbar';

// react-toastify 11 wstrzykuje swoje style sam — osobny import CSS zniknął
import './styles/globals.css';
// latin-ext: bez niego ą/ę/ś/ł/ż nie ma w pobranym podzbiorze fontu i
// przeglądarka dorysowuje je fontem zastępczym (inna grubość i kształt).
const inter = Inter({ subsets: ['latin', 'latin-ext'] });

// Next 15: params są Promise — trasa może ruszyć z renderowaniem, zanim
// segment [locale] zostanie odczytany
type RootLayoutProps = { children: React.ReactNode; params: Promise<{ locale: string }> };

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  // /de/... i inne nieobsługiwane segmenty → 404 zamiast strony po polsku
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
          {/* forcedTheme: aplikacja ma tylko jasny wygląd (komponenty nie mają
              wariantów dark:), a zapamiętany wcześniej "dark" dokładał klasę
              do <html> i psuł np. toasty. Przełącznik zniknął z nawigacji. */}
          <ThemeProvider attribute="class" forcedTheme="light">
            <ReactQueryProvider>
              <AuthHydration />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <CookieNotice />
              {/* było już wołane przez toast() w useApiQuery/useApiMutation,
                  ale bez tego kontenera nic się nie renderowało */}
              <ToastContainer />
            </ReactQueryProvider>
          </ThemeProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
