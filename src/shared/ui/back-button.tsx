'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
  className?: string
  fallbackUrl?: string
}

const BackButton = ({
  className,
  fallbackUrl = '/project',
}: BackButtonProps) => {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex h-8 w-8 items-center justify-start text-muted-foreground/60 transition-colors hover:text-muted-foreground ${className || ''}`}
      title="뒤로가기"
      aria-label="뒤로가기"
    >
      <ArrowLeft className="h-6 w-6" />
    </button>
  )
}

export default BackButton
