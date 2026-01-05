import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow all external images (for development - you may want to restrict in production)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Disable image optimization to avoid issues with external images
    unoptimized: false,
  },
};

export default nextConfig;
