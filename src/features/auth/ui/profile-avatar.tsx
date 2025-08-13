import { Camera } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'

interface ProfileAvatarProps {
  src?: string
  onImageChange?: (imageUrl: string) => void
  onImageSelect: (file: File) => void
}

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]
const MAX_SIZE = 5 * 1024 * 1024

const ProfileAvatar = ({
  src = 'https://github.com/shadcn.png',
  onImageChange,
  onImageSelect,
}: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string>(src)

  // src prop 변경 시 미리보기 동기화
  useEffect(() => {
    setPreviewSrc(src)
  }, [src])
  // Object URL 해제
  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    },
    [objectUrl],
  )

  const handleAvatarClick = () => fileInputRef.current?.click()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > MAX_SIZE) return
    if (!ALLOWED_TYPES.includes(file.type)) return
    onImageSelect(file)
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    const previewUrl = URL.createObjectURL(file)
    setObjectUrl(previewUrl)
    setPreviewSrc(previewUrl)
    onImageChange?.(previewUrl)
  }

  return (
    <div className="flex items-center justify-center">
      <button
        className="flex h-28 w-[110px] items-center justify-center group relative cursor-pointer"
        onClick={handleAvatarClick}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleAvatarClick()
          }
        }}
        type="button"
      >
        <Avatar className="h-full w-full">
          <AvatarImage alt="avatar" src={previewSrc} />
          <AvatarFallback>AvatarImg</AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Camera className="h-6 w-6 text-white" />
        </div>
        <input
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
          type="file"
        />
      </button>
    </div>
  )
}

export default ProfileAvatar
