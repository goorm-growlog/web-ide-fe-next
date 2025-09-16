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

// Monaco 환경 설정
if (typeof window !== 'undefined') {
  window.MonacoEnvironment = {
    getWorker: (_moduleId: string, label: string) => {
      // 언어별로 적절한 워커 사용
      switch (label) {
        case 'typescript':
        case 'javascript':
          // TypeScript 언어 서비스 워커 사용
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/language/typescript/ts.worker',
              import.meta.url,
            ),
          )
        case 'json':
          // JSON 언어 서비스 워커 사용
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/language/json/json.worker',
              import.meta.url,
            ),
          )
        case 'css':
        case 'scss':
        case 'less':
          // CSS 언어 서비스 워커 사용
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/language/css/css.worker',
              import.meta.url,
            ),
          )
        case 'html':
          // HTML 언어 서비스 워커 사용
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/language/html/html.worker',
              import.meta.url,
            ),
          )
        case 'java':
        case 'python':
          // Java와 Python은 기본 에디터 워커 사용 (구문 강조만)
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/editor/editor.worker',
              import.meta.url,
            ),
          )
        default:
          // 기본 에디터 워커 사용
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/editor/editor.worker',
              import.meta.url,
            ),
          )
      }
    },
  }
}

// Monaco 초기화 상태 관리
let isMonacoInitialized = false
let initializationPromise: Promise<void> | null = null

// Monaco 로더 설정 및 초기화
const initializeMonaco = async (): Promise<void> => {
  if (isMonacoInitialized) {
    return Promise.resolve()
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      console.log('Monaco Editor 초기화 시작...')

      // Monaco 로더 설정
      loader.config({ monaco })

      // Monaco 초기화
      await loader.init()

      // Java 언어 등록
      monaco.languages.register({
        id: 'java',
        extensions: ['.java'],
        aliases: ['Java', 'java'],
      })
      monaco.languages.setMonarchTokensProvider('java', {
        tokenizer: {
          root: [
            // 키워드
            [
              /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/,
              'keyword',
            ],
            // 문자열
            [/"[^"]*"/, 'string'],
            [/'[^']*'/, 'string'],
            // 숫자
            [/\d+/, 'number'],
            // 주석
            [/\/\/.*$/, 'comment'],
            [/\/\*/, 'comment', '@comment'],
            // 식별자
            [/[a-zA-Z_$][a-zA-Z0-9_$]*/, 'identifier'],
            // 연산자
            [/[{}()[\]]/, 'delimiter.bracket'],
            [/[<>]=?|[!=]=?|&&|\|\||[+\-*/%&|^~]/, 'operator'],
            [/[;,.]/, 'delimiter'],
          ],
          comment: [
            [/[^/*]+/, 'comment'],
            [/\/\*/, 'comment', '@push'],
            [/\*\//, 'comment', '@pop'],
            [/[/*]/, 'comment'],
          ],
        },
      })

      // Python 언어 등록
      monaco.languages.register({
        id: 'python',
        extensions: ['.py'],
        aliases: ['Python', 'python'],
      })
      monaco.languages.setMonarchTokensProvider('python', {
        tokenizer: {
          root: [
            // 키워드
            [
              /\b(and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield)\b/,
              'keyword',
            ],
            // 문자열
            [/"[^"]*"/, 'string'],
            [/'[^']*'/, 'string'],
            [/""".*?"""/, 'string'],
            [/'''.*?'''/, 'string'],
            // 숫자
            [/\d+/, 'number'],
            // 주석
            [/#.*$/, 'comment'],
            // 식별자
            [/[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],
            // 연산자
            [/[{}()[\]]/, 'delimiter.bracket'],
            [/[<>]=?|[!=]=?|and|or|not|[+\-*/%&|^~]/, 'operator'],
            [/[;,.]/, 'delimiter'],
          ],
        },
      })

      // Java 언어 설정
      monaco.languages.setLanguageConfiguration('java', {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/'],
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
      })

      // Python 언어 설정
      monaco.languages.setLanguageConfiguration('python', {
        comments: {
          lineComment: '#',
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
      })

      isMonacoInitialized = true
      console.log('Monaco Editor 초기화 완료!')
    } catch (error) {
      console.error('Monaco Editor 초기화 실패:', error)
      throw error
    }
  })()

  return initializationPromise
}

export { monaco, initializeMonaco }
