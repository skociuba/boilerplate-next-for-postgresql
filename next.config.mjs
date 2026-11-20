// Sentry 11: konfiguracja builda ma osobne wejście (@sentry/nextjs/config)
import { withSentryConfig } from '@sentry/nextjs/config';
import createNextIntlPlugin from 'next-intl/plugin';

// next-intl 4 domyślnie szuka src/i18n/request.ts — u nas konfiguracja
// leży w src/i18n.js, więc ścieżka podana wprost
const withNextIntl = createNextIntlPlugin('./src/i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: `${process.env.BASE_URL}/:path*`
      }
    ];
  }
};

// Sentry przy buildzie: wysyła source mapy, żeby błąd z przeglądarki
// pokazywał PostsList.tsx:42 zamiast zminifikowanego 4f2a.js:1:3482.
// Token (SENTRY_AUTH_TOKEN) jest tylko w CI, przekazany do Dockera jako
// build secret — lokalnie i w E2E go nie ma i wysyłka jest pomijana.
export default withSentryConfig(withNextIntl(nextConfig), {
  org: 'skociuba',
  project: 'javascript-nextjs',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Wydanie = commit, z którego zbudowano obraz (build-arg w CI). Obraz
  // powstaje raz, przy merge'u na master, a numer wersji dostaje dopiero
  // później (release.yml przetagowuje gotowy obraz), więc sha jest tym, co
  // jest znane w chwili buildu.
  release: { name: process.env.SENTRY_RELEASE },
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
    // Po wysłaniu mapy są kasowane z buildu — nie trafiają do obrazu, więc
    // nikt nie pobierze z serwera pełnego, czytelnego kodu źródłowego
    deleteSourcemapsAfterUpload: true
  },
  // Logi pluginu tylko przy wysyłce map (CI), lokalny build bez szumu
  silent: !process.env.SENTRY_AUTH_TOKEN,
  telemetry: false,
  // Awaria Sentry albo zły token nie może blokować wydania: bez map błędy
  // będą mniej czytelne, ale aplikacja działa tak samo
  errorHandler: (error) => {
    console.warn('Sentry: nie udało się wysłać source map —', error.message);
  }
});
