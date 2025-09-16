'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * Hydration 에러 방지를 위한 클라이언트 전용 래퍼
 * 서버에서는 렌더링되지 않고 클라이언트에서만 렌더링됨
 * 간헐적 hydration mismatch 방지를 위해 더 강력한 클라이언트 체크 적용
 */
const GitHubCookieSetup = dynamic(
  () => import('@/features/auth/social/ui/github-cookie-setup'),
  {
    ssr: false,
    loading: () => null, // 로딩 중에는 아무것도 렌더링하지 않음
  },
)

export default function ClientOnlyWrapper() {
  const [isClient, setIsClient] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // 클라이언트 사이드 렌더링 확인
    setIsClient(true)

    // 마운트 완료 확인 (추가 안전장치)
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // 클라이언트에서만 렌더링하고 마운트가 완료된 후에만 컴포넌트 표시
  if (!isClient || !isMounted) {
    return null
  }

  return <GitHubCookieSetup />
}
