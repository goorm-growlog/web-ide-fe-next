// src/stores/useEditorTabsStore.ts
import { create } from 'zustand'
import type { FileMetadata } from '@/shared/types/types'
import { useYjsSessionStore } from './use-yjs-session-store'
import { useUserStore } from './user-store'

interface EditorTabsStoreState {
  openedFileIds: string[]
  activeFileId: string | null
  filePaths: Map<string, string>
  openFileInEditor: (metadata: FileMetadata, projectId: string) => void
  closeTab: (fileId: string) => void
  setActiveFileId: (fileId: string, projectId?: string) => void
  clearAllTabs: () => void
}

export const useEditorTabsStore = create<EditorTabsStoreState>((set, get) => ({
  openedFileIds: [],
  activeFileId: null,
  filePaths: new Map(),

  openFileInEditor: (metadata, projectId) => {
    const { ensureUserInfo } = useUserStore.getState()
    const userInfo = ensureUserInfo()

    if (!projectId || !userInfo) return

    useYjsSessionStore.getState().openSession(projectId, metadata, userInfo)

    if (!get().filePaths.has(metadata.id)) {
      set(state => ({
        openedFileIds: [...state.openedFileIds, metadata.id],
        filePaths: new Map(state.filePaths).set(metadata.id, metadata.filepath),
      }))
    }
    get().setActiveFileId(metadata.id, projectId)
  },

  closeTab: fileIdToClose => {
    const { openedFileIds, activeFileId } = get()

    const currentIndex = openedFileIds.indexOf(fileIdToClose)
    if (currentIndex === -1) return

    //핵심 수정: 탭을 닫을 때 해당 파일의 Yjs 세션도 함께 정리
    const { closeSession } = useYjsSessionStore.getState()
    closeSession(fileIdToClose)

    const newOpenedFileIds = openedFileIds.filter(id => id !== fileIdToClose)
    let newActiveFileId = activeFileId

    if (activeFileId === fileIdToClose) {
      if (newOpenedFileIds.length > 0) {
        const nextIndex = Math.max(0, currentIndex - 1)
        newActiveFileId = newOpenedFileIds[nextIndex] ?? null
      } else {
        newActiveFileId = null
      }
    }

    const newPaths = new Map(get().filePaths)
    newPaths.delete(fileIdToClose)

    set({
      openedFileIds: newOpenedFileIds,
      activeFileId: newActiveFileId,
      filePaths: newPaths,
    })
  },

  setActiveFileId: (fileId, projectId) => {
    set({ activeFileId: fileId })

    //핵심 수정: 탭 전환 시에도 세션이 열려있는지 확인하고 열어주기
    if (fileId && projectId) {
      const { sessions, openSession } = useYjsSessionStore.getState()
      if (!sessions.has(fileId)) {
        // 세션이 없다면 파일 메타데이터를 찾아서 세션을 열어야 함
        const { ensureUserInfo } = useUserStore.getState()
        const userInfo = ensureUserInfo()
        const currentState = get()

        if (userInfo) {
          const filePath = currentState.filePaths.get(fileId)
          if (filePath) {
            const metadata = { id: fileId, filepath: filePath }
            openSession(projectId, metadata, userInfo)
          }
        }
      }
    }
  },

  // 프로젝트 전환 시에만 완전한 정리, 일반 탭 닫기는 Y.Doc 보존
  clearAllTabs: () => {
    const { openedFileIds } = get()
    const { closeSession } = useYjsSessionStore.getState()

    // UI 세션만 정리 (Y.Doc는 유지)
    openedFileIds.forEach(fileId => {
      closeSession(fileId)
    })

    set({
      openedFileIds: [],
      activeFileId: null,
      filePaths: new Map(),
    })

    // 프로젝트 전환 시에만 실제 Y.Doc 정리 (websocketPool에서 처리)
    // 현재는 Y.Doc를 보존하여 세션 복구 가능
  },
}))
