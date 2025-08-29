'use client'

import Link from 'next/link'
import { cn } from '@/shared/lib/utils'

interface CodeLinkProps {
  text: string
  url: string
  className?: string
}

/**
 * 코드 파일 링크를 렌더링하는 컴포넌트
 *
 * @param text - 텍스트
 * @param url - 이동할 내부 링크 URL
 * @param className - 컴포넌트 스타일 클래스
 */
export const CodeLink = ({ text, url, className }: CodeLinkProps) => {
  return (
    <Link
      href={url}
      className={cn(
        'text-sm underline',
        'text-blue-600 visited:text-purple-600 hover:text-blue-800 visited:hover:opacity-80',
        className,
      )}
      title={text}
    >
      {text}
    </Link>
  )
}
