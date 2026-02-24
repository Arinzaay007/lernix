import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Needed for streaming in edge routes
    serverActions: {
      allowedOrigins: ['localhost:3000', process.env.NEXT_PUBLIC_APP_URL ?? ''],
    },
  },
  // Allow images from Supabase storage if you add avatars later
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

export default nextConfig
