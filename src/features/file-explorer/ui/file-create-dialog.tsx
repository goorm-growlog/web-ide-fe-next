'use client'

import {
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'
import { FILE_EXPLORER_TEXTS } from '@/features/file-explorer/constants/texts'
import type { ItemType } from '@/features/file-explorer/model/types'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@/shared/ui/shadcn'

export interface FileCreateDialogRef {
  readonly openAsFile: (targetPath: string) => void
  readonly openAsFolder: (targetPath: string) => void
}

interface FileCreateDialogProps {
  readonly createFile: (targetPath: string, fileName: string) => void
  readonly createFolder: (targetPath: string, folderName: string) => void
}

export const FileCreateDialog = forwardRef<
  FileCreateDialogRef,
  FileCreateDialogProps
>(({ createFile, createFolder }, ref) => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<ItemType | null>(null)
  const [targetPath, setTargetPath] = useState('')
  const [inputValue, setInputValue] = useState('')

  useImperativeHandle(ref, () => ({
    openAsFile: path => {
      setType('file')
      setTargetPath(path)
      setInputValue(FILE_EXPLORER_TEXTS.NEW_FILE_DEFAULT)
      setOpen(true)
    },
    openAsFolder: path => {
      setType('folder')
      setTargetPath(path)
      setInputValue(FILE_EXPLORER_TEXTS.NEW_FOLDER_DEFAULT)
      setOpen(true)
    },
  }))

  const handleClose = useCallback(() => {
    setOpen(false)
    setInputValue('')
    setTargetPath('')
  }, [])

  const handleCreate = useCallback(() => {
    if (!inputValue.trim()) return
    if (type === 'file') createFile(targetPath, inputValue)
    if (type === 'folder') createFolder(targetPath, inputValue)
    handleClose()
  }, [type, targetPath, inputValue, createFile, createFolder, handleClose])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          handleCreate()
          break
        case 'Escape':
          e.preventDefault()
          handleClose()
          break
        default:
          return
      }
    },
    [handleCreate, handleClose],
  )

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        handleClose()
      }
    },
    [handleClose],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'file'
              ? FILE_EXPLORER_TEXTS.NEW_FILE
              : FILE_EXPLORER_TEXTS.NEW_FOLDER}
          </DialogTitle>
        </DialogHeader>
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={
            type === 'file'
              ? FILE_EXPLORER_TEXTS.FILE_PLACEHOLDER
              : FILE_EXPLORER_TEXTS.FOLDER_PLACEHOLDER
          }
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!inputValue.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

FileCreateDialog.displayName = 'FileCreateDialog'

export default FileCreateDialog
