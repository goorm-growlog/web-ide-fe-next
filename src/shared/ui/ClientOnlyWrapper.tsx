'use client'

import dynamic from 'next/dynamic'

/**
 * Hydration 에러 방지를 위한 클라이언트 전용 래퍼
 */
const GitHubCookieSetup = dynamic(
  () => import('@/features/auth/social/ui/GitHubCookieSetup'),
  { ssr: false },
)

export default function ClientOnlyWrapper() {
  return <GitHubCookieSetup />
}
