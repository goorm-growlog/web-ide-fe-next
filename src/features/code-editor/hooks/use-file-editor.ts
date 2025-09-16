import { useCallback, useMemo, useState } from 'react'
import type { EditorFile, FileEditorState, FileTab } from '../types'

/**
 * 파일 에디터 상태 관리 훅
 * 여러 파일을 관리하고 활성 파일을 추적하며 탭 기능 제공
 */
export const useFileEditor = () => {
  const [state, setState] = useState<FileEditorState>({
    files: {},
    activeFileId: null,
    isLoading: false,
  })

  const openFile = useCallback((file: EditorFile) => {
    setState(prev => ({
      ...prev,
      files: { ...prev.files, [file.id]: file },
      activeFileId: file.id,
    }))
  }, [])

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setState(prev => {
      const currentFile = prev.files[fileId]
      if (!currentFile) return prev

      return {
        ...prev,
        files: {
          ...prev.files,
          [fileId]: { ...currentFile, content },
        },
      }
    })
  }, [])

  const closeFile = useCallback((fileId: string) => {
    setState(prev => {
      const newFiles = { ...prev.files }
      delete newFiles[fileId]

      const newActiveFileId =
        prev.activeFileId === fileId
          ? Object.keys(newFiles)[0] || null
          : prev.activeFileId

      return {
        ...prev,
        files: newFiles,
        activeFileId: newActiveFileId,
      }
    })
  }, [])

  const setActiveFileId = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      activeFileId: fileId,
    }))
  }, [])

  const getActiveFile = useCallback((): EditorFile | null => {
    if (!state.activeFileId) return null
    return state.files[state.activeFileId] || null
  }, [state.activeFileId, state.files])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }))
  }, [])

  // 탭 관련 기능
  const tabs = useMemo((): FileTab[] => {
    return Object.values(state.files).map(file => ({
      id: file.id,
      name: file.name,
      path: file.path,
      isActive: file.id === state.activeFileId,
    }))
  }, [state.files, state.activeFileId])

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveFileId(tabId)
    },
    [setActiveFileId],
  )

  const handleTabClose = useCallback(
    (tabId: string) => {
      closeFile(tabId)
    },
    [closeFile],
  )

  return {
    ...state,
    openFile,
    updateFileContent,
    closeFile,
    setActiveFileId,
    getActiveFile,
    setLoading,
    // 탭 관련
    tabs,
    handleTabClick,
    handleTabClose,
  }
}
