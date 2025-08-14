'use client'

import type * as monaco from 'monaco-editor'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface EditorViewState {
  cursorPosition: monaco.IPosition | null
  selection: monaco.ISelection | null
  scrollTop: number
  scrollLeft: number
  viewState: monaco.editor.ICodeEditorViewState | null
  lastUpdated: number
}

interface ViewStateStore {
  viewStates: Record<string, EditorViewState>
  saveViewState: (
    projectId: string,
    fileId: string,
    state: EditorViewState,
  ) => void
  getViewState: (
    projectId: string,
    fileId: string,
  ) => EditorViewState | undefined
  hasViewState: (projectId: string, fileId: string) => boolean
  clearViewState: (projectId: string, fileId: string) => void
  clearProjectViewStates: (projectId: string) => void
  getViewStateCount: () => number
}

export const useViewStateStore = create<ViewStateStore>()(
  persist(
    (set, get) => ({
      viewStates: {},

      saveViewState: (projectId, fileId, state) => {
        const key = `${projectId}/${fileId}`
        set(store => ({
          viewStates: {
            ...store.viewStates,
            [key]: { ...state, lastUpdated: Date.now() },
          },
        }))
      },

      getViewState: (projectId, fileId) => {
        const key = `${projectId}/${fileId}`
        return get().viewStates[key]
      },

      hasViewState: (projectId, fileId) => {
        const key = `${projectId}/${fileId}`
        return Boolean(get().viewStates[key])
      },

      clearViewState: (projectId, fileId) => {
        const key = `${projectId}/${fileId}`
        set(store => {
          const newViewStates = { ...store.viewStates }
          delete newViewStates[key]
          return { viewStates: newViewStates }
        })
      },

      clearProjectViewStates: projectId =>
        set(store => {
          const filtered = Object.fromEntries(
            Object.entries(store.viewStates).filter(
              ([key]) => !key.startsWith(`${projectId}/`),
            ),
          )
          return { viewStates: filtered }
        }),

      getViewStateCount: () => Object.keys(get().viewStates).length,
    }),
    {
      name: 'editor-view-states',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
