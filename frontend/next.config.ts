import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flowbite.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      //       {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '5000',
      //   pathname: '/alpha/**',
      // },
      {
        protocol: 'http',
        hostname: 'revamp.alpha-odin.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'revamp.alpha-odin.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);