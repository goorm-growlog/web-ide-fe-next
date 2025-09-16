import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

// Monaco Editor Worker 설정
interface MonacoEnvironment {
  getWorker: (moduleId: string, label: string) => Worker
}

declare global {
  interface Window {
    MonacoEnvironment: MonacoEnvironment
  }
}

const createMonacoEnvironment = (): MonacoEnvironment => ({
  getWorker: (_moduleId: string, _label: string) => {
    return new Worker(
      new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url),
    )
  },
})

// Monaco 환경 설정
if (typeof window !== 'undefined') {
  window.MonacoEnvironment = createMonacoEnvironment()
}

// Monaco 로더 설정
loader.config({ monaco })
loader.init()

export { monaco }
