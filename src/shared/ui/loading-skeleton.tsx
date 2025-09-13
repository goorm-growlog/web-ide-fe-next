'use client'

import { cn } from '@/shared/lib/utils'

/**
 * 스피너 로딩 컴포넌트
 * shadcn/ui 스타일에 맞춘 회전 애니메이션
 */
export const LoadingSpinner = ({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary',
        sizeClasses[size],
        className,
      )}
    />
  )
}
