'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

/**
 * GitHub 로그인 시 리프레시 토큰 쿠키 설정
 *
 * NextAuth 서버 콜백으로는 브라우저 쿠키 설정이 불가능하므로
 * 클라이언트에서 별도로 백엔드 API 호출하여 HttpOnly 쿠키 설정
 */
export default function GitHubCookieSetup() {
  const { data: session } = useSession()
  const setupCompleteRef = useRef(false)

  useEffect(() => {
    if (
      setupCompleteRef.current ||
      !session?.needsCookieSetup ||
      !session?.githubUser
    ) {
      return
    }

    setupCompleteRef.current = true

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
      .then(() => console.log('GitHub cookie setup complete'))
      .catch(error => {
        console.error('GitHub cookie setup failed:', error)
        setupCompleteRef.current = false
      })
  }, [session?.needsCookieSetup, session?.githubUser])

  return null
}
