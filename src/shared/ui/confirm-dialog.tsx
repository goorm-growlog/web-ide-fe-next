'use client'

import { Button } from '@/shared/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive' | 'warning'
  isLoading?: boolean
  targetName?: string // 대상 이름을 굵게 표시하기 위한 props
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
  isLoading = false,
  targetName,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm()
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  // variant별 버튼 스타일 설정
  const getConfirmButtonProps = () => {
    switch (variant) {
      case 'destructive':
        return { variant: 'destructive' as const }
      case 'warning':
        return {
          variant: 'default' as const,
          className: 'bg-amber-600 text-white hover:bg-amber-700',
        }
      default:
        return { variant: 'default' as const }
    }
  }

  // 설명 텍스트에 targetName이 있으면 굵게 표시
  const renderDescription = () => {
    if (!targetName) {
      return description
    }

    const parts = description.split(targetName)
    if (parts.length === 1) {
      return description
    }

    return (
      <>
        {parts[0]}
        <span className="font-semibold">{targetName}</span>
        {parts.slice(1).join(targetName)}
      </>
    )
  }

  const confirmButtonProps = getConfirmButtonProps()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{renderDescription()}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            {...confirmButtonProps}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
