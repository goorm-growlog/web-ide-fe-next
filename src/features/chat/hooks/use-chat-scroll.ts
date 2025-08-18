import { useCallback, useEffect, useRef } from 'react'
import { requestScrollToBottom } from '@/shared/lib/scroll-utils'
import type { ChatMessage } from '../model/types'

const SELECTORS = '[data-radix-scroll-area-viewport]'

export const useChatScroll = (messages: ChatMessage[]) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isFirstLoad = useRef(true)

  // 스크롤 요소를 찾는 함수
  const getScrollElement = useCallback((): HTMLElement | null => {
    return scrollAreaRef.current?.querySelector(SELECTORS) as HTMLElement | null
  }, [])

  // 첫 번째 로드 시 스크롤을 최하단으로
  useEffect(() => {
    const scrollElement = getScrollElement()
    if (!scrollElement) return

    if (isFirstLoad.current && messages.length > 0) {
      scrollElement.scrollTop = scrollElement.scrollHeight
      isFirstLoad.current = false
    }
  }, [messages, getScrollElement])

  // 메시지 전송 후 스크롤을 최하단으로
  const scrollToBottom = useCallback(() => {
    const scrollElement = getScrollElement()
    if (scrollElement) {
      requestScrollToBottom(scrollElement)
    }
  }, [getScrollElement])

  return { scrollAreaRef, scrollToBottom }
}
