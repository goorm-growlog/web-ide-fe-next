'use client'

import { AlertTriangle, Info, Trash2 } from 'lucide-react'
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

  // variant별 아이콘과 버튼 스타일 설정
  const getVariantConfig = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: <Trash2 className="h-5 w-5 text-destructive" />,
          buttonProps: { variant: 'destructive' as const },
          titleColor: 'text-destructive',
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
          buttonProps: {
            variant: 'default' as const,
            className: 'bg-amber-600 text-white hover:bg-amber-700',
          },
          titleColor: 'text-amber-600',
        }
      default:
        return {
          icon: <Info className="h-5 w-5 text-primary" />,
          buttonProps: { variant: 'default' as const },
          titleColor: 'text-foreground',
        }
    }
  }

  const variantConfig = getVariantConfig()

  // 설명 텍스트 렌더링 (줄바꿈 및 targetName 처리)
  const renderDescription = () => {
    const lines = description.split('\n')

    return lines.map((line, lineIndex) => {
      let lineContent: React.ReactNode = line

      // targetName이 있고 현재 줄에 포함되어 있으면 굵게 표시
      if (targetName && line.includes(targetName)) {
        const parts = line.split(targetName)
        lineContent = (
          <>
            {parts[0]}
            <span className="font-semibold text-foreground">{targetName}</span>
            {parts.slice(1).join(targetName)}
          </>
        )
      }

      return (
        <span
          key={`${title}-line-${lineIndex}-${line.slice(0, 10)}`}
          className="block leading-relaxed"
        >
          {lineContent}
        </span>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader className="gap-4">
          <div className="flex items-center gap-3">
            {variantConfig.icon}
            <DialogTitle className="font-semibold text-lg">
              <span className={variantConfig.titleColor}>{title}</span>
            </DialogTitle>
          </div>
          <DialogDescription className="text-left">
            {renderDescription()}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            {...variantConfig.buttonProps}
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
