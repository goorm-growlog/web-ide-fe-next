import type { ParsedChatMessage } from '@/features/chat/model/types'
import { CodeLink } from '@/features/chat/ui/chat-message/code-link'

interface MessageContentProps {
  parts: ParsedChatMessage['parts']
}

/**
 * 메시지 파트를 렌더링하는 컴포넌트
 */
export const MessageContent = ({ parts }: MessageContentProps) => {
  return (
    <>
      {parts.map((part, index) => {
        if (part.link) {
          // 링크가 있는 경우 - 더 안정적인 key 생성
          return (
            <CodeLink
              key={`${part.link.fileName}-${part.link.lineNumber}-${index}`}
              fileName={part.link.fileName}
              lineNumber={part.link.lineNumber}
              url={part.link.url}
            />
          )
        }
        // 일반 텍스트인 경우 - 더 안정적인 key 생성
        const textKey = part.displayText
          ? `text-${part.displayText.slice(0, 20).replace(/\s+/g, '-')}-${index}`
          : `text-${index}`

        return <span key={textKey}>{part.displayText}</span>
      })}
    </>
  )
}
