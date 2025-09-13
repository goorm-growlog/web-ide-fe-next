export const logger = {
  debug:
    process.env.NODE_ENV === 'development'
      ? console.debug
      : () => {
          /* no-op */
        },
  warn: console.warn,
  error: console.error,
}
