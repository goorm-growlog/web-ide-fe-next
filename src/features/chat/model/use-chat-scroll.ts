import { useEffect, useRef } from 'react'
import type { Message } from '@/features/chat/model/message-types'
import { requestScrollToBottom } from '@/shared/lib/scroll-utils'

// Radix UI ScrollArea 컴포넌트와 함께 사용하도록 설계
const SCROLL_AREA_VIEWPORT_SELECTOR = '[data-slot="scroll-area-viewport"]'

/**
 * 채팅 메시지 자동 스크롤 훅
 *
 * @description 새로운 메시지가 추가될 때마다 채팅 영역을 자동으로 맨 아래로 스크롤
 * requestAnimationFrame cleanup을 활용하여 메모리 누수를 방지
 *
 * @param messages - 채팅 메시지 배열
 * @returns ScrollArea 컴포넌트에 전달할 ref 객체
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const [messages, setMessages] = useState<Message[]>([])
 *   const { scrollAreaRef } = useChatScroll(messages)
 *
 *   return (
 *     <ScrollArea ref={scrollAreaRef}>
 *       {messages.map(message => <MessageItem key={message.id} {...message} />)}
 *     </ScrollArea>
 *   )
 * }
 * ```
 */
export const useChatScroll = (messages: Message[]) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageCount = useRef(0)

  useEffect(() => {
    if (messages.length > lastMessageCount.current) {
      const scrollElement = scrollAreaRef.current?.querySelector(
        SCROLL_AREA_VIEWPORT_SELECTOR,
      )

      if (scrollElement instanceof HTMLElement) {
        const cleanup = requestScrollToBottom(scrollElement)
        lastMessageCount.current = messages.length
        return cleanup
      }

      lastMessageCount.current = messages.length
    }
  }, [messages.length])

  return {
    scrollAreaRef,
  }
}
