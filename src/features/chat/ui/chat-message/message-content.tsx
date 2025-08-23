import type {
  MessagePart,
  ParsedChatMessage,
} from '@/features/chat/model/types'
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
      {parts.map((part: MessagePart, index: number) => {
        if (part.link) {
          return (
            <CodeLink
              key={`${part.link.fileName}-${part.link.lineNumber}-${index}`}
              fileName={part.link.fileName}
              lineNumber={part.link.lineNumber}
              url={part.link.url}
            />
          )
        }

        // 메시지가 삭제되지 않으므로 index를 key로 사용해도 무방함
        const textKey = `text-${part.displayText.slice(0, 20).replace(/\s+/g, '-')}-${index}`

        return <span key={textKey}>{part.displayText}</span>
      })}
    </>
  )
}
