'use client'

import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import ProfileAvatar from '@/features/profile/profile-avatar/ui/profile-avatar'
import { useAuthProvider } from '@/shared/hooks/use-auth-provider'
import type { User } from '@/shared/types/user'
import FormField from '@/shared/ui/form-field'
import { Button, Form } from '@/shared/ui/shadcn'
import type { ProfileEditFormData } from '../model/schema'
import { useProfileEditActions } from '../model/use-profile-edit-actions'
import DeleteAccountDialog from './delete-account-dialog'
import PasswordSection from './password-section'

interface ProfileEditFormProps {
  form: UseFormReturn<ProfileEditFormData>
  user: User | undefined
}

const ProfileEditForm = ({ form, user }: ProfileEditFormProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)

  const { isSocialLogin } = useAuthProvider()
  const { isLoading, handleUpdateProfile, handleDeleteAccount } =
    useProfileEditActions()

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async (password: string) => {
    await handleDeleteAccount(password)
  }

  const handleImageSelect = (file: File) => {
    setProfileImageFile(file)
  }

  const handleSubmit = async (data: ProfileEditFormData) => {
    await handleUpdateProfile(data, profileImageFile, user?.name)

    // 제출 후 비밀번호 필드 초기화
    form.setValue('currentPassword', '')
    form.setValue('newPassword', '')
    form.setValue('confirmPassword', '')

    // 프로필 이미지 상태 초기화
    setProfileImageFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Profile Avatar */}
      <div className="flex justify-center">
        <ProfileAvatar
          src={user?.profileImage}
          onImageSelect={handleImageSelect}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Email Field (Read-only) */}
          <div className="space-y-1.5">
            <div className="font-medium text-foreground text-sm">Email</div>
            <div className="flex w-full rounded-md border border-input bg-muted px-3 py-2 text-muted-foreground text-sm">
              {user?.email || ''}
            </div>
          </div>

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Enter your name"
          />

          {/* Password Section - 소셜 로그인 사용자는 비밀번호 변경 불가 */}
          <PasswordSection form={form} isSocialUser={isSocialLogin} />

          {/* Submit Button - Full Width */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
          >
            Save Changes
          </Button>
        </form>
      </Form>

      {/* Delete Account Section - Outside form */}
      <div>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="w-full text-right text-destructive text-xs transition-colors hover:text-destructive/80"
        >
          Delete your account
        </button>
      </div>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isSocialLogin={isSocialLogin}
      />
    </div>
  )
}

export default ProfileEditForm
