'use client'

import Link from 'next/link'
import { isExternalLink } from '@/features/chat/lib/chat-message-utils'
import { cn } from '@/shared/lib/utils'

/**
 * 코드 링크 공통 스타일
 */
const CODE_LINK_STYLES = cn(
  'inline text-sm underline',
  'text-blue-600 visited:text-purple-600 hover:text-blue-800 visited:hover:opacity-80',
  'focus:rounded focus:outline-2 focus:outline-ring focus:outline-offset-2',
)

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
        className={CODE_LINK_STYLES}
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
      className={CODE_LINK_STYLES}
      title={displayText}
      aria-label={displayText}
    >
      {displayText}
    </Link>
  )
}
