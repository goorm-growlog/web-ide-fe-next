'use client'

import type { editor, IDisposable } from 'monaco-editor'
import { useEffect, useRef } from 'react'
import { useEditorTabsStore } from '../../model/use-panes-store'
import { useViewStateStore } from '../../model/use-view-state-store'
import { useYjsSessionStore } from '../../model/use-yjs-session-store'
import { useUserStore } from '../../model/user-store'

/**
 * Monaco Editor 인스턴스와 활성화된 파일의 Yjs 세션을 연결하는 역할을 담당하는 훅.
 * 바인딩 관리는 useYjsSessionStore에서 담당하고, 여기서는 에디터 연결만 처리합니다.
 */
export const useEditorSessionManager = (
  editor: editor.IStandaloneCodeEditor | null,
  projectId: string,
) => {
  const previousFileIdRef = useRef<string | null>(null)
  const disposablesRef = useRef<IDisposable[]>([])
  const { activeFileId } = useEditorTabsStore()
  const { sessions, connectEditorToSession, disconnectEditorFromSession } =
    useYjsSessionStore()
  const { saveViewState, getViewState } = useViewStateStore()
  const { ensureUserInfo } = useUserStore()
  const userInfo = ensureUserInfo()

  // 컴포넌트 언마운트 시 에디터 연결 정리
  useEffect(() => {
    return () => {
      // 현재 연결된 에디터가 있다면 모든 세션에서 연결 해제
      if (editor && previousFileIdRef.current) {
        disconnectEditorFromSession(previousFileIdRef.current, editor)
      }
      disposablesRef.current.forEach(d => {
        d.dispose()
      })
      disposablesRef.current = []
    }
  }, [editor, disconnectEditorFromSession])

  useEffect(() => {
    // 1. 기존 이벤트 리스너 정리
    disposablesRef.current.forEach(disposable => {
      disposable.dispose()
    })
    disposablesRef.current = []

    // 2. 이전 파일의 뷰 상태 저장 및 에디터 연결 해제
    if (
      previousFileIdRef.current &&
      editor &&
      previousFileIdRef.current !== activeFileId &&
      projectId
    ) {
      const viewState = editor.saveViewState()
      if (viewState) {
        saveViewState(projectId, previousFileIdRef.current, {
          cursorPosition: editor.getPosition(),
          selection: editor.getSelection(),
          scrollTop: editor.getScrollTop(),
          scrollLeft: editor.getScrollLeft(),
          viewState,
          lastUpdated: Date.now(),
        })
      }

      // 이전 파일에서 에디터 연결 해제
      disconnectEditorFromSession(previousFileIdRef.current, editor)
    }

    // 3. 유효성 검사
    if (!editor || !activeFileId) {
      return
    }

    // 4. 활성화된 파일에 해당하는 Yjs 세션 정보 가져오기
    const session = sessions.get(activeFileId)
    if (!session) {
      return
    }

    const { textModel, yProvider } = session

    // 5. 에디터에 새 모델 설정
    if (editor.getModel() !== textModel) {
      try {
        if (textModel.isDisposed()) {
          return
        }
        editor.setModel(textModel)
      } catch (_error) {
        return
      }
    }

    // 6. 현재 파일에 에디터 연결
    connectEditorToSession(activeFileId, editor)

    // 7. 파일 ID 업데이트
    previousFileIdRef.current = activeFileId

    // 8. awareness에 사용자 정보 설정 (✅ setLocalStateField 사용으로 안전성 확보)
    if (yProvider.awareness && userInfo) {
      yProvider.awareness.setLocalStateField('user', userInfo)
      if (activeFileId) {
        yProvider.awareness.setLocalStateField('activeFile', activeFileId)
      }
    }

    // 9. 뷰 상태 복원
    setTimeout(() => {
      if (editor.getModel() === textModel && projectId) {
        const savedState = getViewState(projectId, activeFileId)
        if (savedState?.viewState) {
          editor.restoreViewState(savedState.viewState)
        }
      }
    }, 200)

    // 10. 뷰 상태 자동 저장을 위한 이벤트 리스너 설정
    const saveCurrentViewState = () => {
      if (projectId) {
        const viewState = editor.saveViewState()
        if (viewState) {
          saveViewState(projectId, activeFileId, {
            cursorPosition: editor.getPosition(),
            selection: editor.getSelection(),
            scrollTop: editor.getScrollTop(),
            scrollLeft: editor.getScrollLeft(),
            viewState,
            lastUpdated: Date.now(),
          })
        }
      }
    }

    const disposables: IDisposable[] = [
      editor.onDidChangeCursorPosition(saveCurrentViewState),
      editor.onDidScrollChange(saveCurrentViewState),
      editor.onDidChangeCursorSelection(saveCurrentViewState),
    ]

    disposablesRef.current = disposables
  }, [
    editor,
    activeFileId,
    sessions,
    projectId,
    saveViewState,
    getViewState,
    userInfo, // 6. 현재 파일에 에디터 연결
    connectEditorToSession, // 이전 파일에서 에디터 연결 해제
    disconnectEditorFromSession,
  ])
}
