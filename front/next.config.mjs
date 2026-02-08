/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      '@/lib': path.join(__dirname, 'lib'),
      '@/models': path.join(__dirname, 'models')  // Changed this line
    };
    return config;
  },
  // Add experimental features for NextAuth.js
  experimental: {
    serverActions: {},
  },
  serverExternalPackages: ['mongoose', 'bcryptjs'],
  // Add this to handle API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

export default nextConfig;