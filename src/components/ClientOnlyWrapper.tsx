'use client'

import dynamic from 'next/dynamic'

// 클라이언트에서만 렌더링되는 GitHubCookieSetup 컴포넌트
const GitHubCookieSetup = dynamic(
  () => import('@/components/GitHubCookieSetup'),
  {
    ssr: false,
  },
)

export default function ClientOnlyWrapper() {
  return <GitHubCookieSetup />
}
