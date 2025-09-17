import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    // 환경변수 로드 설정
    env: {
      NODE_ENV: 'test',
    },
    // NextAuth 모듈 문제 해결을 위한 설정
    deps: {
      external: ['next-auth'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
