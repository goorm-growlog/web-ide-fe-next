'use client'

import Editor, { type OnMount } from '@monaco-editor/react'
import { useEffect, useState } from 'react'
import { initializeMonaco } from '../lib/monaco-setup'
import type { EditorConfig } from '../types'
import { DEFAULT_EDITOR_CONFIG } from '../types'

interface MonacoEditorProps {
  value: string
  language: string
  onChange?: (value: string | undefined) => void
  onMount?: OnMount
  height?: string | number
  config?: Partial<EditorConfig>
}

/**
 * Monaco Editor 컴포넌트
 * 완전 독립적으로 동작하며 기존 코드와 연동하지 않음
 */
export const MonacoEditor = ({
  value,
  language,
  onChange,
  onMount,
  height = '100%',
  config = {},
}: MonacoEditorProps) => {
  const editorConfig = { ...DEFAULT_EDITOR_CONFIG, ...config }
  const [isMonacoReady, setIsMonacoReady] = useState(false)
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  )

  // Monaco 환경 설정 로드
  useEffect(() => {
    const initMonaco = async () => {
      try {
        console.log('Monaco Editor 초기화 시도...')
        await initializeMonaco()
        setIsMonacoReady(true)
        console.log('Monaco Editor 준비 완료!')
      } catch (error) {
        console.error('Monaco Editor 초기화 실패:', error)
        setInitializationError(
          error instanceof Error ? error.message : 'Unknown error',
        )
      }
    }

    initMonaco()
  }, [])

  const handleMount: OnMount = (editor, monaco) => {
    console.log('Monaco Editor 마운트됨:', { language, editor, monaco })

    // TypeScript 언어 서비스 설정
    if (language === 'typescript' || language === 'javascript') {
      console.log('TypeScript/JavaScript 언어 서비스 설정 중...')

      // TypeScript 컴파일러 옵션 설정
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types'],
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      })

      // TypeScript 언어 서비스 설정
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
        noSuggestionDiagnostics: false,
      })

      // TypeScript 언어 서비스 워커 설정
      monaco.languages.typescript.typescriptDefaults.setWorkerOptions({
        customWorkerPath: 'monaco-editor/esm/vs/language/typescript/ts.worker',
      })

      // JavaScript 언어 서비스 설정
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        allowJs: true,
        checkJs: true,
        typeRoots: ['node_modules/@types'],
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      })

      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
        noSuggestionDiagnostics: false,
      })

      // JavaScript 언어 서비스 워커 설정
      monaco.languages.typescript.javascriptDefaults.setWorkerOptions({
        customWorkerPath: 'monaco-editor/esm/vs/language/typescript/ts.worker',
      })

      console.log('TypeScript/JavaScript 언어 서비스 설정 완료!')
    }

    // 에디터가 마운트되었을 때 호출
    onMount?.(editor, monaco)
  }

  // Monaco가 준비되지 않았을 때 로딩 화면 표시
  if (!isMonacoReady) {
    if (initializationError) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-lg text-red-500">⚠️</div>
            <h3 className="mb-2 font-semibold text-lg">
              Monaco Editor 로딩 실패
            </h3>
            <p className="mb-4 text-gray-600 text-sm">{initializationError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-blue-500 border-b-2"></div>
          <p className="text-gray-600 text-sm">Monaco Editor 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      {...(onChange && { onChange })}
      onMount={handleMount}
      theme={editorConfig.theme}
      options={{
        fontSize: editorConfig.fontSize,
        minimap: { enabled: editorConfig.minimap },
        wordWrap: editorConfig.wordWrap,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection',
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: 'on',
        // IntelliSense 및 자동완성 설정
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showFunctions: true,
          showConstructors: true,
          showFields: true,
          showVariables: true,
          showClasses: true,
          showStructs: true,
          showInterfaces: true,
          showModules: true,
          showProperties: true,
          showEvents: true,
          showOperators: true,
          showUnits: true,
          showValues: true,
          showConstants: true,
          showEnums: true,
          showEnumMembers: true,
          showColors: true,
          showFiles: true,
          showReferences: true,
          showFolders: true,
          showTypeParameters: true,
          showUsers: true,
          showIssues: true,
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        wordBasedSuggestions: 'off',
        parameterHints: { enabled: true },
        hover: { enabled: true },
        contextmenu: true,
        mouseWheelZoom: true,
        multiCursorModifier: 'ctrlCmd',
        formatOnPaste: true,
        formatOnType: true,
        // TypeScript 관련 설정
        ...(language === 'typescript' || language === 'javascript'
          ? {
              // TypeScript/JavaScript 전용 설정
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              unfoldOnClickAfterEnd: false,
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
            }
          : {}),
      }}
    />
  )
}
