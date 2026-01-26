import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Optimizaciones para Chromebook ARM64
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
