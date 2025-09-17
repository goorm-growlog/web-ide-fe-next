'use client'

import {
  LiveblocksProvider,
  RoomProvider,
  useMutation,
  useOthers,
  useStorage,
  useUpdateMyPresence,
} from '@liveblocks/react'
import { Editor } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useCallback, useEffect, useRef } from 'react'

interface CollaborativeMonacoEditorProps {
  roomId: string
  value?: string
  onChange?: (value: string) => void
  language?: string
  theme?: string
  readOnly?: boolean
  className?: string
}

// 내부 에디터 컴포넌트 (RoomProvider 내부에서 사용)
function CollaborativeEditorCore({
  onChange,
  language = 'typescript',
  theme = 'vs-light',
  readOnly = false,
  className,
}: Omit<CollaborativeMonacoEditorProps, 'roomId' | 'value'>) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  // Liveblocks 훅들
  const sharedContent = useStorage(root => root.content)
  const updateContent = useMutation(({ storage }, newContent: string) => {
    storage.set('content', newContent)
  }, [])

  const others = useOthers()
  const updateMyPresence = useUpdateMyPresence()

  // Monaco Editor 초기화
  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor

      // 커서 위치 업데이트
      editor.onDidChangeCursorPosition(() => {
        const position = editor.getPosition()
        if (position) {
          updateMyPresence({
            cursor: {
              x: position.column,
              y: position.lineNumber,
            },
          })
        }
      })
    },
    [updateMyPresence],
  )

  // 에디터 내용 변경 감지 (스토리지 로드 후에만 등록)
  useEffect(() => {
    if (!editorRef.current || sharedContent === undefined) return

    const editor = editorRef.current
    const disposable = editor.onDidChangeModelContent(() => {
      const content = editor.getValue()
      updateContent(content)
      if (onChange) {
        onChange(content)
      }
    })

    return () => {
      disposable.dispose()
    }
  }, [sharedContent, updateContent, onChange])

  // 공유 내용 변경 시 에디터 업데이트
  useEffect(() => {
    if (
      editorRef.current &&
      sharedContent !== undefined &&
      sharedContent !== editorRef.current.getValue()
    ) {
      const editor = editorRef.current
      const newContent = String(sharedContent)

      // 현재 커서 위치 저장
      const currentPosition = editor.getPosition()

      // executeEdits로 내용 업데이트 (커서 위치 유지)
      const model = editor.getModel()
      if (model) {
        editor.executeEdits('remote-update', [
          {
            range: model.getFullModelRange(),
            text: newContent,
          },
        ])
      }

      // 커서 위치 복원
      if (currentPosition) {
        editor.setPosition(currentPosition)
      }
    }
  }, [sharedContent])

  // 다른 사용자들의 커서 표시
  useEffect(() => {
    if (!editorRef.current) return

    console.log('Others:', others)
    console.log('Others length:', others.length)

    const decorations = others
      .map(other => {
        console.log('Other:', other)
        console.log('Other presence:', other.presence)
        console.log('Other cursor:', other.presence?.cursor)

        if (other.presence?.cursor) {
          const cursor = other.presence.cursor as { x: number; y: number }
          const userName =
            (other.presence.user as { name?: string })?.name ||
            `User ${String(other.connectionId).slice(-4)}`

          console.log('Creating decoration for:', userName, 'at:', cursor)

          return {
            range: {
              startLineNumber: cursor.y,
              startColumn: cursor.x,
              endLineNumber: cursor.y,
              endColumn: cursor.x,
            },
            options: {
              className: 'collaborative-cursor',
              hoverMessage: { value: userName },
            },
          }
        }
        return null
      })
      .filter(
        (decoration): decoration is NonNullable<typeof decoration> =>
          decoration !== null,
      )

    console.log('Decorations:', decorations)
    editorRef.current.deltaDecorations([], decorations)
  }, [others])

  // CSS 스타일 추가
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .collaborative-cursor {
        background-color: rgba(255, 0, 0, 0.3) !important;
        width: 2px !important;
        animation: cursor-blink 1s infinite;
      }

      @keyframes cursor-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className={className} style={{ height: '100%' }}>
      <Editor
        height="100%"
        language={language}
        theme={theme}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          fontSize: 14,
          lineHeight: 20,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}

// 메인 컴포넌트 (LiveblocksProvider + RoomProvider로 감싸기)
export function CollaborativeMonacoEditor(
  props: CollaborativeMonacoEditorProps,
) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks/auth">
      <RoomProvider
        id={props.roomId}
        initialStorage={{ content: props.value || '' }}
      >
        <CollaborativeEditorCore {...props} />
      </RoomProvider>
    </LiveblocksProvider>
  )
}
