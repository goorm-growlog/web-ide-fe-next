'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import type { ItemType } from '@/features/file-explorer/model/types'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog'
import { Input } from '@/shared/ui/shadcn/input'

interface CreateItemDialogProps {
  readonly isOpen: boolean
  readonly type: ItemType
  readonly defaultName?: string
  readonly onConfirm: (name: string) => void
  readonly onCancel: () => void
  readonly title?: string
  readonly placeholder?: string
}

export const CreateItemDialog = ({
  isOpen,
  type,
  defaultName = '',
  onConfirm,
  onCancel,
  title,
  placeholder,
}: CreateItemDialogProps) => {
  const [inputValue, setInputValue] = useState(defaultName)

  const handleConfirm = () => {
    if (!inputValue.trim()) return
    onConfirm(inputValue.trim())
    setInputValue('')
  }

  const handleCancel = () => {
    onCancel()
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultName)
    }
  }, [isOpen, defaultName])

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title || `Create New ${type === 'file' ? 'File' : 'Folder'}`}
          </DialogTitle>
        </DialogHeader>
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={placeholder || `Enter ${type} name`}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!inputValue.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
