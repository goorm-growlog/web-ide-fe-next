// 🎯 WebSocket 스토어 공통 로거
const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  debug: isDev
    ? console.debug
    : () => {
        /* no-op */
      },
  warn: console.warn,
  error: console.error,
}
