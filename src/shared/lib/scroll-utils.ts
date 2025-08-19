// 스크롤을 최하단으로 이동
export const scrollToBottom = (element: HTMLElement): void => {
  if (!element || !(element instanceof HTMLElement)) return

  try {
    element.scrollTop = element.scrollHeight
  } catch {
    console.error('Failed to scroll to bottom')
  }
}

// 부드러운 스크롤로 최하단으로 이동
export const smoothScrollToBottom = (element: HTMLElement): void => {
  if (!element || !(element instanceof HTMLElement)) return

  try {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth',
    })
  } catch {
    // 부드러운 스크롤이 지원되지 않는 경우 일반 스크롤 사용
    scrollToBottom(element)
    console.error('Failed to smooth scroll to bottom')
  }
}

// requestAnimationFrame을 사용한 스크롤
export const requestScrollToBottom = (element: HTMLElement): void => {
  if (!element || !(element instanceof HTMLElement)) return

  requestAnimationFrame(() => {
    scrollToBottom(element)
    console.error('Failed to request scroll to bottom')
  })
}
