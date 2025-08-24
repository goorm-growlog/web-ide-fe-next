import { useCallback, useEffect, useRef } from 'react'
import type { Message } from '@/features/chat/model/types'
import { scrollToBottom } from '@/shared/lib/scroll-utils'

const SCROLL_AREA_VIEWPORT_SELECTOR = '[data-radix-scroll-area-viewport]'

export const useChatScroll = (messages: Message[]) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageCount = useRef(0)
  const isInitialMount = useRef(true)

  const scrollToBottomHandler = useCallback(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      SCROLL_AREA_VIEWPORT_SELECTOR,
    )
    if (!scrollElement || !(scrollElement instanceof HTMLElement)) return

    scrollToBottom(scrollElement)
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      lastMessageCount.current = messages.length
      return
    }

    if (messages.length > lastMessageCount.current) {
      scrollToBottomHandler()
      lastMessageCount.current = messages.length
    }
  }, [messages, scrollToBottomHandler])

  return { scrollAreaRef, scrollToBottom: scrollToBottomHandler }
}
