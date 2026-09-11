import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

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
