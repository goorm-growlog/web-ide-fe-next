// src/(yjs)/yjs-editor/components/CollaborativeEditor.tsx
'use client'

import { Editor, type OnMount } from '@monaco-editor/react'
import type { editor as MonacoEditor } from 'monaco-editor'
import { useEffect, useState } from 'react'
import { Cursors } from '../cursor/ui/cursors'
import { useEditorSessionManager } from '../lib/hooks/use-editor-session-manager'
import { useEditorTabsStore } from '../model/use-panes-store'
import { useYjsSessionStore } from '../model/use-yjs-session-store'
import { useUserStore } from '../model/user-store'

interface CollaborativeEditorProps {
  projectId: string
}

export const CollaborativeEditor = ({
  projectId,
}: CollaborativeEditorProps) => {
  const [editor, setEditor] =
    useState<MonacoEditor.IStandaloneCodeEditor | null>(null)

  const { activeFileId } = useEditorTabsStore()
  const { ensureUserInfo } = useUserStore()

  // 협업 기능 사용 시점에 사용자 초기화
  const userInfo = ensureUserInfo()
  const session = useYjsSessionStore(state =>
    activeFileId ? state.sessions.get(activeFileId) : null,
  )

  //커서 위치 업데이트용
  useEffect(() => {
    if (session?.yProvider && activeFileId) {
      // activeFile을 awareness에 업데이트
      session.yProvider.awareness?.setLocalStateField(
        'activeFile',
        activeFileId,
      )
    }
  }, [session?.yProvider, activeFileId])

  // useEditorSessionManager 훅이 모든 바인딩과 뷰 상태 관리를 담당
  useEditorSessionManager(editor, projectId)

  const handleEditorDidMount: OnMount = editorInstance => {
    setEditor(editorInstance)
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{ automaticLayout: true }}
      />
      {editor && session && activeFileId && userInfo && (
        <Cursors
          provider={session.yProvider}
          activeFileId={activeFileId}
          currentUserId={userInfo.email}
        />
      )}
    </div>
  )
}
