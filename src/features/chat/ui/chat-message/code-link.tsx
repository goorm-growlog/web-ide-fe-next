'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import styles from './chat-message.module.css'

// 외부 링크인지 판별하는 함수
// 외부 링크인지 판별 (SSR/CSR에서 동일한 결과 보장)
const isExternalLink = (url: string): boolean => {
  // 상대 경로는 내부 링크로 간주
  if (url.startsWith('/')) return false

  try {
    const u = new URL(url)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl) {
      const siteOrigin = new URL(siteUrl).origin
      return u.origin !== siteOrigin
    }
    // SITE_URL이 없으면 절대 URL은 모두 외부로 처리
    return true
  } catch {
    // 절대 URL이 아니거나 잘못된 형식 → 내부 링크
    return false
  }
}

interface CodeLinkProps {
  fileName: string
  lineNumber: number
  url: string
}

// 코드 링크를 렌더링하는 컴포넌트
export const CodeLink = ({ fileName, lineNumber, url }: CodeLinkProps) => {
  // 메모이제이션으로 성능 최적화
  const displayText = useMemo(
    () => `${fileName}:${lineNumber}`,
    [fileName, lineNumber],
  )
  const isExternal = useMemo(() => isExternalLink(url), [url])

  // 외부 링크인 경우 a 태그 사용
  if (isExternal) {
    return (
      <a
        href={url}
        className={styles.codeLink}
        title={`${displayText} (new tab)`}
        aria-label={`${displayText} (opens in a new tab)`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {displayText}
      </a>
    )
  }

  // 내부 링크인 경우 Next.js Link 컴포넌트 사용
  return (
    <Link
      href={url}
      className={styles.codeLink}
      title={displayText}
      aria-label={displayText}
    >
      {displayText}
    </Link>
  )
}
