import { Camera } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import type { ProfileAvatarProps } from '../model/types'
import { useProfileAvatar } from '../model/use-profile-avatar'
import styles from './profile-avatar.module.css'

const ProfileAvatar = (props: ProfileAvatarProps) => {
  const { fileInputRef, previewSrc, handleAvatarClick, handleFileChange } =
    useProfileAvatar(props)

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.avatarButton}
        onClick={handleAvatarClick}
        aria-label="change profile image"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleAvatarClick()
          }
        }}
        type="button"
      >
        <Avatar className={styles.avatar}>
          <AvatarImage alt="" src={previewSrc} />
          <AvatarFallback>AvatarImg</AvatarFallback>
        </Avatar>
        <div className={styles.overlay}>
          <Camera className={styles.cameraIcon} />
        </div>
      </button>
      <input
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
    </div>
  )
}

export default ProfileAvatar
