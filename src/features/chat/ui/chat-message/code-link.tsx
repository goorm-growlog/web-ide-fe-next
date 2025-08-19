'use client'

import Link from 'next/link'
import { isExternalLink } from '@/features/chat/lib/chat-message-utils'
import styles from './chat-message.module.css'

interface CodeLinkProps {
  fileName: string
  lineNumber: number
  url: string
}

/**
 * 코드 파일 링크를 렌더링하는 컴포넌트
 *
 * - 외부 링크인 경우 `<a>` 태그로 새 탭에서 열립니다.
 * - 내부 링크인 경우 Next.js의 `<Link>` 컴포넌트를 사용합니다.
 *
 * @param fileName - 파일 이름
 * @param lineNumber - 코드 라인 번호
 * @param url - 이동할 링크 URL
 */
export const CodeLink = ({ fileName, lineNumber, url }: CodeLinkProps) => {
  const displayText = `${fileName}:${lineNumber}`

  if (isExternalLink(url)) {
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
