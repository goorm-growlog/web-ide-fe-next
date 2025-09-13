/**
 * HTML 요소를 최하단으로 스크롤
 *
 * @description 주어진 HTML 요소의 scrollTop을 scrollHeight로 설정하여 콘텐츠의 맨 아래로 스크롤
 *
 * @param element - 스크롤할 HTML 요소
 * @returns 성공 여부 (true: 성공, false: 실패)
 */
const scrollToBottom = (element: HTMLElement): boolean => {
  if (!element || !(element instanceof HTMLElement)) return false

  try {
    element.scrollTop = element.scrollHeight
    return true
  } catch (err) {
    const { message = 'Unknown error', stack } = err as Error

    console.error('Failed to scroll to bottom:', {
      message,
      stack,
      elementId: element.id,
    })

    return false
  }
}

/**
 * requestAnimationFrame을 사용하여 부드러운 스크롤을 수행
 *
 * @description 다음 브라우저 렌더링 프레임에서 스크롤을 실행
 * cleanup 함수를 반환하여 필요시 애니메이션 취소 가능
 *
 * @param element - 스크롤할 HTML 요소
 * @returns cleanup 함수 (애니메이션 취소용)
 *
 * @example
 * ```tsx
 * // React 컴포넌트에서 사용
 * const chatRef = useRef<HTMLDivElement>(null)
 *
 * const handleNewMessage = () => {
 *   if (chatRef.current) {
 *     const cleanup = requestScrollToBottom(chatRef.current)
 *
 *     // 필요시 cleanup으로 애니메이션 취소
 *     // cleanup()
 *   }
 * }
 *
 * // 또는 cleanup 함수를 useEffect에서 활용
 * useEffect(() => {
 *   if (messages.length > 0 && chatRef.current) {
 *     return requestScrollToBottom(chatRef.current)
 *   }
 * }, [messages])
 * ```
 */
export const requestScrollToBottom = (element: HTMLElement): (() => void) => {
  const animationId = requestAnimationFrame(() => {
    try {
      scrollToBottom(element)
    } catch (error) {
      console.error('Failed to request scroll to bottom:', error)
    }
  })

  return () => cancelAnimationFrame(animationId)
}
