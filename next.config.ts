import type { NextConfig } from 'next';

// productionBrowserSourceMaps: false,
// productionSourceMaps: false,
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '.*',
        port: '',
        pathname: '/**',
      },
    ],
  }, 
  webpack(config, { dev, isServer }) {
    // Desabilita source maps em produção
    if (!dev && !isServer) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
