import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import type { ProfileAvatarProps } from '@/features/profile/profile-avatar/model/types'
import {
  ALLOWED_TYPES,
  MAX_SIZE,
} from '@/features/profile/profile-avatar/model/utils'

export const useProfileAvatar = ({
  src = 'https://github.com/shadcn.png',
  onImageChange,
  onImageSelect,
}: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string>(src)

  useEffect(() => {
    setPreviewSrc(src)
  }, [src])

  useEffect(
    () => () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    },
    [objectUrl],
  )

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > MAX_SIZE) return
    if (!ALLOWED_TYPES.includes(file.type)) return

    onImageSelect?.(file)

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
    }

    const newPreviewUrl = URL.createObjectURL(file)
    setObjectUrl(newPreviewUrl)
    setPreviewSrc(newPreviewUrl)
    onImageChange?.(newPreviewUrl)
  }

  return {
    fileInputRef,
    previewSrc,
    handleAvatarClick,
    handleFileChange,
  }
}
