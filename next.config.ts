import type { NextConfig } from 'next'

// API_TARGET 유효성 검사 및 정규화
const validateAndNormalizeApiTarget = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  // 환경변수 존재 여부 확인
  if (!apiBaseUrl) {
    const errorMsg = 'NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.'
    console.error(errorMsg)
    throw new Error(errorMsg)
  }

  // HTTP/HTTPS 스킴 검증
  if (!apiBaseUrl.startsWith('http://') && !apiBaseUrl.startsWith('https://')) {
    const errorMsg = `NEXT_PUBLIC_API_BASE_URL은 "http://" 또는 "https://"로 시작해야 합니다. 현재 값: ${apiBaseUrl}`
    console.error(errorMsg)
    throw new Error(errorMsg)
  }

  // 후행 슬래시 제거
  const normalizedUrl = apiBaseUrl.replace(/\/+$/, '')

  console.log(`✅ API_TARGET 설정됨: ${normalizedUrl}`)
  return normalizedUrl
}

const API_TARGET = validateAndNormalizeApiTarget()

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
