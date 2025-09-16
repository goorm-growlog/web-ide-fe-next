'use client'

import { useProfileEditForm } from '@/features/profile/profile-edit/model/use-profile-edit-form'
import ProfileEditForm from '@/features/profile/profile-edit/ui/profile-edit-form'
import { useAuth } from '@/app/providers/auth-provider'
import BackButton from '@/shared/ui/back-button'

const ProfilePage = () => {
  const { user, isLoading: userLoading, isSocialLogin } = useAuth()
  const { form } = useProfileEditForm({ defaultName: user?.name })

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-6 space-y-4 pb-20">
        <div className="mb-4 flex justify-start">
          <BackButton fallbackUrl="/project" />
        </div>
        
        <header className="space-y-1.5">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </header>
        
        <hr className="border-border/80" />
        
        <ProfileEditForm
          form={form}
          user={user}
          isSocialLogin={isSocialLogin}
        />
      </div>
    </div>
  )
}

export default ProfilePage
