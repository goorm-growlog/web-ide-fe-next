import { useCallback, useEffect, useRef } from 'react'
import type { ChatMessage } from '@/features/chat/model/types'
import { scrollToBottom } from '@/shared/lib/scroll-utils'

// Radix UI ScrollArea의 뷰포트 선택자
const SCROLL_AREA_VIEWPORT_SELECTOR = '[data-radix-scroll-area-viewport]'

export const useChatScroll = (messages: ChatMessage[]) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageCount = useRef(0)

  // 최하단으로 스크롤
  const scrollToBottomHandler = useCallback(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      SCROLL_AREA_VIEWPORT_SELECTOR,
    ) as HTMLElement | null
    if (!scrollElement) return

    scrollToBottom(scrollElement)
  }, [])

  // 메시지가 새로 추가되었을 때만 최하단으로 스크롤
  useEffect(() => {
    if (messages.length > lastMessageCount.current) {
      scrollToBottomHandler()
      lastMessageCount.current = messages.length
    }
  }, [messages, scrollToBottomHandler])

  return { scrollAreaRef, scrollToBottom: scrollToBottomHandler }
}
