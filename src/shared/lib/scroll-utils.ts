// 스크롤을 최하단으로 이동
export const scrollToBottom = (element: HTMLElement) => {
  element.scrollTop = element.scrollHeight
}

// 부드러운 스크롤로 최하단으로 이동
export const smoothScrollToBottom = (element: HTMLElement) => {
  element.scrollTo({
    top: element.scrollHeight,
    behavior: 'smooth',
  })
}

// requestAnimationFrame을 사용한 스크롤
export const requestScrollToBottom = (element: HTMLElement) => {
  requestAnimationFrame(() => {
    scrollToBottom(element)
  })
}
