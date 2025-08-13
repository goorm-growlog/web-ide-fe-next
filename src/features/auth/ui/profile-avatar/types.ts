export interface ProfileAvatarProps {
  src?: string
  onImageChange?: (imageUrl: string) => void
  onImageSelect: (file: File) => void
}
