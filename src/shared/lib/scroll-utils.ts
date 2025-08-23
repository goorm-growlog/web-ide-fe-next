// 스크롤을 최하단으로 이동
export const scrollToBottom = (element: HTMLElement): boolean => {
  if (!element || !(element instanceof HTMLElement)) return false

  try {
    element.scrollTop = element.scrollHeight
    return true
  } catch (err) {
    const { message, stack } = err as Error

    console.error('Failed to scroll to bottom:', {
      message,
      stack,
      elementId: element.id,
    })

    return false
  }
}

// 부드러운 스크롤로 최하단으로 이동
export const smoothScrollToBottom = (element: HTMLElement): boolean => {
  if (!element || !(element instanceof HTMLElement)) return false

  try {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth',
    })
    return true
  } catch {
    // 부드러운 스크롤이 지원되지 않는 경우 일반 스크롤 사용
    const fallbackResult = scrollToBottom(element)

    return fallbackResult
  }
}

// requestAnimationFrame을 사용한 스크롤
// 반환값: cleanup 함수를 호출하여 스크롤을 취소할 수 있음
export const requestScrollToBottom = (element: HTMLElement): (() => void) => {
  if (!element || !(element instanceof HTMLElement)) {
    return () => {} // 빈 cleanup 함수 반환
  }

  const animationId = requestAnimationFrame(() => {
    try {
      scrollToBottom(element)
    } catch {
      console.error('Failed to request scroll to bottom')
    }
  })

  // cleanup 함수 반환
  return () => {
    cancelAnimationFrame(animationId)
  }
}
