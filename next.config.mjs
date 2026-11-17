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

export default withNextIntl(nextConfig);
