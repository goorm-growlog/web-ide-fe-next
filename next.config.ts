import type { NextConfig } from 'next'

const API_TARGET = process.env.NEXT_PUBLIC_API_BASE_URL

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: `${API_TARGET}/auth/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${API_TARGET}/:path*`,
      },
    ]
  },
}

export default nextConfig
