export interface ProfileAvatarProps {
  src?: string | undefined
  onImageChange?: (imageUrl: string) => void
  onImageSelect: (file: File) => void
}
