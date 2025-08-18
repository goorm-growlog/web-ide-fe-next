'use client'

import Link from 'next/link'
import { useCallback, useMemo } from 'react'
import styles from './chat-message.module.css'

// 외부 링크인지 판별하는 함수
const isExternalLink = (url: string): boolean => {
  try {
    const urlObj = new URL(url)

    // 현재 도메인과 다른 경우 외부 링크
    if (typeof window !== 'undefined') {
      const currentDomain = window.location.hostname
      return urlObj.hostname !== currentDomain
    }

    // 서버 사이드에서는 기본적으로 외부 링크로 처리
    return true
  } catch {
    // URL 파싱에 실패한 경우 (상대 경로 등) 내부 링크로 처리
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

  const handleClick = useCallback(() => {
    // 외부 링크인 경우 새 탭에서 열기
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    // 내부 링크는 Link 컴포넌트가 처리
  }, [url, isExternal])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        // Enter나 Space 키로도 클릭 가능하도록
        if (isExternal) {
          window.open(url, '_blank', 'noopener,noreferrer')
        }
      }
    },
    [url, isExternal],
  )

  // 외부 링크인 경우 a 태그 사용
  if (isExternal) {
    return (
      <a
        href={url}
        className={styles.codeLink}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        title={`${displayText} (new tab)`}
        aria-label={displayText}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={0}
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
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={displayText}
      aria-label={displayText}
      tabIndex={0}
    >
      {displayText}
    </Link>
  )
}
