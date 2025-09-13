import type React from 'react'
import { create } from 'zustand'
import type { FileNode } from '@/features/file-explorer/types/client'

/**
 * 파일 트리 스토어의 초기 상태
 */
export const initialFileTreeState = {
  flatFileNodes: null,
  isLoading: true,
  error: null,
} as const

interface FileTreeState {
  // File tree data
  flatFileNodes: Record<string, FileNode> | null
  isLoading: boolean
  error: string | null

  // File tree operations
  setFlatFileNodes: React.Dispatch<
    React.SetStateAction<Record<string, FileNode> | null>
  >
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setError: React.Dispatch<React.SetStateAction<string | null>>
  updateNode: (path: string, updates: Partial<FileNode>) => void
  addNode: (path: string, node: FileNode) => void
  removeNode: (path: string) => void
  refresh: () => void
  clear: () => void
}

export const useFileTreeStore = create<FileTreeState>((set, get) => ({
  // Initial state
  ...initialFileTreeState,

  // State setters (React.Dispatch type support)
  setFlatFileNodes: updater =>
    set(prev => {
      if (typeof updater === 'function') {
        return { flatFileNodes: updater(prev.flatFileNodes) }
      }
      return { flatFileNodes: updater }
    }),
  setIsLoading: updater =>
    set(prev => {
      if (typeof updater === 'function') {
        return { isLoading: updater(prev.isLoading) }
      }
      return { isLoading: updater }
    }),
  setError: updater =>
    set(prev => {
      if (typeof updater === 'function') {
        return { error: updater(prev.error) }
      }
      return { error: updater }
    }),

  // Update specific node
  updateNode: (path, updates) => {
    const { flatFileNodes } = get()
    if (!flatFileNodes || !flatFileNodes[path]) return

    set({
      flatFileNodes: {
        ...flatFileNodes,
        [path]: {
          ...flatFileNodes[path],
          ...updates,
        },
      },
    })
  },

  // Add new node
  addNode: (path, node) => {
    const { flatFileNodes } = get()
    set({
      flatFileNodes: {
        ...flatFileNodes,
        [path]: node,
      },
    })
  },

  // Remove node
  removeNode: path => {
    const { flatFileNodes } = get()
    if (!flatFileNodes) return

    const newNodes = { ...flatFileNodes }
    delete newNodes[path]
    set({ flatFileNodes: newNodes })
  },

  // Data refresh (trigger tree update by state reset)
  refresh: () =>
    set({
      flatFileNodes: null,
      isLoading: true,
      error: null,
    }),

  // State reset
  clear: () =>
    set({
      flatFileNodes: null,
      isLoading: true,
      error: null,
    }),
}))
