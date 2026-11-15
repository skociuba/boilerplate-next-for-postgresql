import { AuthHydration } from '@/providers/AuthHydration';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import { CookieNotice } from '@/layout/CookieNotice';
import { Footer } from '@/layout/Footer';
import Navbar from '@/layout/Navbar';

import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
// latin-ext: bez niego ą/ę/ś/ł/ż nie ma w pobranym podzbiorze fontu i
// przeglądarka dorysowuje je fontem zastępczym (inna grubość i kształt).
const inter = Inter({ subsets: ['latin', 'latin-ext'] });

type RootLayoutProps = { children: React.ReactNode; params: { locale: string } };

export default function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  const messages = useMessages();

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
