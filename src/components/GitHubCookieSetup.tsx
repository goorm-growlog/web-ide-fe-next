'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

export default function GitHubCookieSetup() {
  const { data: session } = useSession()
  const setupCompleteRef = useRef(false)

  useEffect(() => {
    // 이미 설정이 완료되었거나, 설정이 필요하지 않은 경우 무시
    if (
      setupCompleteRef.current ||
      !session?.needsCookieSetup ||
      !session?.githubUser
    ) {
      return
    }

    // 설정 시작 플래그
    setupCompleteRef.current = true

    // GitHub 로그인 후 클라이언트에서 쿠키 설정을 위한 호출
    fetch('/auth/login/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id: session.githubUser.id,
        name: session.githubUser.name || '',
        email: session.githubUser.email || '',
        avatarUrl: session.githubUser.image || '',
      }),
    })
      .then(() => {
        console.log('✅ GitHub 리프레시 토큰 쿠키 설정 완료')
        // 플래그 제거 (세션 업데이트하지 않음)
      })
      .catch(error => {
        console.error('❌ GitHub 쿠키 설정 실패:', error)
        // 실패 시 다시 시도할 수 있도록 플래그 리셋
        setupCompleteRef.current = false
      })
  }, [session?.needsCookieSetup, session?.githubUser])

  return null // UI 렌더링하지 않음
}
