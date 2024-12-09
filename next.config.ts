import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com', // Ajuste para os domínios permitidos
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com', // Outro domínio permitido
        port: '',
        pathname: '/**',
      },
    ],
  },
  productionBrowserSourceMaps: false, // Desabilita source maps no navegador em produção
  webpack(config) {
    // Configurações adicionais para o Webpack podem ser adicionadas aqui
    return config;
  },
};

export default nextConfig;



