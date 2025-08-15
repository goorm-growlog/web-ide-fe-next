import { useCallback, useState } from 'react'
import type { PasswordResetData } from '@/features/auth/model/validation-schema'

interface UsePasswordResetDialogModelProps {
  onSubmit: (data: PasswordResetData) => Promise<void>
}

export function usePasswordResetDialogModel({
  onSubmit,
}: UsePasswordResetDialogModelProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
  }, [])

  const handleSubmit = useCallback(
    async (data: PasswordResetData) => {
      setIsLoading(true)
      try {
        await onSubmit(data)
        setOpen(false) // 다이얼로그 닫기 책임을 model에서 처리
      } finally {
        setIsLoading(false)
      }
    },
    [onSubmit],
  )

  return {
    open,
    isLoading,
    onOpenChange: handleOpenChange,
    onSubmit: handleSubmit,
    setOpen, // 필요시 외부에서 강제 제어
  }
}
