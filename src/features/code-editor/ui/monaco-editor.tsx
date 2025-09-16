'use client'

import Editor, { type OnMount } from '@monaco-editor/react'
import { useEffect } from 'react'
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

  // Monaco 환경 설정 로드
  useEffect(() => {
    import('../lib/monaco-setup')
  }, [])

  const handleMount: OnMount = (editor, monaco) => {
    // 에디터가 마운트되었을 때 호출
    onMount?.(editor, monaco)
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
      }}
    />
  )
}
