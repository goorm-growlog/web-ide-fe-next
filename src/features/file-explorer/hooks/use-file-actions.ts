import type { ItemInstance } from '@headless-tree/core'
import { useCallback, useState } from 'react'
import { FILE_EXPLORER_TEXTS } from '@/features/file-explorer/constants/texts'
import { handleNewFile as createFileHandler } from '@/features/file-explorer/lib/new-file-handler'
import { handleNewFolder as createFolderHandler } from '@/features/file-explorer/lib/new-folder-handler'
import type { FileNode } from '@/features/file-explorer/model/types'

type CreateDialogType = 'file' | 'folder'

interface CreateDialogState {
  readonly isOpen: boolean
  readonly type: CreateDialogType
  readonly targetPath: string
  readonly defaultName: string
}

interface UseFileActionsProps {
  readonly rootId: string
}

interface UseFileActionsReturn {
  readonly createDialog: CreateDialogState
  readonly inputValue: string
  readonly setInputValue: (value: string) => void
  readonly handleNewFile: (item: ItemInstance<FileNode>) => void
  readonly handleNewFolder: (item: ItemInstance<FileNode>) => void
  readonly handleCreateConfirm: () => void
  readonly handleCreateCancel: () => void
}

export const useFileActions = ({
  rootId,
}: UseFileActionsProps): UseFileActionsReturn => {
  const [createDialog, setCreateDialog] = useState<CreateDialogState>({
    isOpen: false,
    type: 'file',
    targetPath: '',
    defaultName: '',
  })
  const [inputValue, setInputValue] = useState('')

  const getTargetPath = useCallback(
    (item: ItemInstance<FileNode>) => {
      return item.isFolder()
        ? item.getId()
        : item.getParent()?.getId() || rootId
    },
    [rootId],
  )

  const handleNewFile = useCallback(
    (item: ItemInstance<FileNode>) => {
      if (item.isFolder()) item.expand()
      const targetPath = getTargetPath(item)

      setCreateDialog({
        isOpen: true,
        type: 'file',
        targetPath,
        defaultName: FILE_EXPLORER_TEXTS.NEW_FILE_DEFAULT,
      })
      setInputValue(FILE_EXPLORER_TEXTS.NEW_FILE_DEFAULT)
    },
    [getTargetPath],
  )

  const handleNewFolder = useCallback(
    (item: ItemInstance<FileNode>) => {
      if (item.isFolder()) item.expand()
      const targetPath = getTargetPath(item)

      setCreateDialog({
        isOpen: true,
        type: 'folder',
        targetPath,
        defaultName: FILE_EXPLORER_TEXTS.NEW_FOLDER_DEFAULT,
      })
      setInputValue(FILE_EXPLORER_TEXTS.NEW_FOLDER_DEFAULT)
    },
    [getTargetPath],
  )

  const handleCreateConfirm = useCallback(() => {
    if (!inputValue.trim()) return

    const { type, targetPath } = createDialog

    if (type === 'file') {
      createFileHandler(targetPath, inputValue)
    } else {
      createFolderHandler(targetPath, inputValue)
    }

    setCreateDialog(prev => ({ ...prev, isOpen: false }))
    setInputValue('')
  }, [inputValue, createDialog])

  const handleCreateCancel = useCallback(() => {
    setCreateDialog(prev => ({ ...prev, isOpen: false }))
    setInputValue('')
  }, [])

  return {
    createDialog,
    inputValue,
    setInputValue,
    handleNewFile,
    handleNewFolder,
    handleCreateConfirm,
    handleCreateCancel,
  }
}
