import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/vps2',
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
