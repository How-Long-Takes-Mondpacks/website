import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.discordapp.com',
        port: '',
        search: '',
      },
      {
        protocol: 'https',
        hostname: '**.forgecdn.net',
        port: '',
        search: '',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        search: '',
      }
    ]
  },
};

export default nextConfig;
