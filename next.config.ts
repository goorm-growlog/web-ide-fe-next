import type { NextConfig } from 'next'

const API_TARGET = process.env.NEXT_PUBLIC_API_BASE_URL

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // NextAuth 관련 엔드포인트는 제외하고 백엔드로 프록시
      {
        source: '/auth/:path*',
        destination: `${API_TARGET}/auth/:path*`,
      },
      {
        source: '/api/projects/:path*',
        destination: `${API_TARGET}/projects/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${API_TARGET}/users/:path*`,
      },
      // NextAuth의 /api/auth/* 는 로컬에서 처리 (프록시 안함)
    ]
  },
}

export default nextConfig
