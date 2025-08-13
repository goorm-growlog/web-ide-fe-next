import { create } from 'zustand'

interface PaneState {
  id: string
  openedFileIds: string[]
  activeFileId: string | null
}

interface PanesStore {
  panes: PaneState[]
  ensurePane: (paneId: string) => void
  openFile: (paneId: string, fileId: string) => void
  closeFile: (paneId: string, fileId: string) => void
  setActiveFile: (paneId: string, fileId: string | null) => void
}

const usePanesStore = create<PanesStore>(set => ({
  panes: [],

  // Pane이 없으면 자동 생성
  ensurePane: paneId =>
    set(state => {
      if (state.panes.some(p => p.id === paneId)) return state
      return {
        panes: [
          ...state.panes,
          { id: paneId, openedFileIds: [], activeFileId: null },
        ],
      }
    }),

  openFile: (paneId, fileId) =>
    set(state => {
      const panes = state.panes.map(pane => {
        if (pane.id !== paneId) return pane

        // 이미 열려있으면 active만 변경
        if (pane.openedFileIds.includes(fileId)) {
          return { ...pane, activeFileId: fileId }
        }

        // 아니면 추가 + active 변경
        return {
          ...pane,
          openedFileIds: [...pane.openedFileIds, fileId],
          activeFileId: fileId,
        }
      })

      return { panes }
    }),

  closeFile: (paneId, fileId) =>
    set(state => {
      const panes = state.panes.map(pane => {
        if (pane.id !== paneId) return pane

        const opened = pane.openedFileIds.filter(id => id !== fileId)
        const newActive =
          pane.activeFileId === fileId
            ? (opened.at(-1) ?? null)
            : pane.activeFileId

        return {
          ...pane,
          openedFileIds: opened,
          activeFileId: newActive,
        }
      })

      return { panes }
    }),

  setActiveFile: (paneId, fileId) =>
    set(state => ({
      panes: state.panes.map(pane =>
        pane.id === paneId ? { ...pane, activeFileId: fileId } : pane,
      ),
    })),
}))

export { usePanesStore }
