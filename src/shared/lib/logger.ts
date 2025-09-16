export const logger = {
  debug: (...args: unknown[]) => {
    // 개발 환경이거나 브라우저 환경에서는 항상 로그 출력
    if (
      process.env.NODE_ENV === 'development' ||
      typeof window !== 'undefined'
    ) {
      console.log('[DEBUG]', ...args)
    }
  },
  warn: console.warn,
  error: console.error,
  info: console.info,
  log: console.log,
}
