'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useInviteUser } from '../hooks/use-invitations'
import { useProjectId } from '../hooks/use-project-id'
import { InvitationForm } from './invitation-form'

export default function InviteFormPanel() {
  const projectId = useProjectId()
  const { inviteUser } = useInviteUser({ projectId })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInviteMember = async (data: {
    email: string
    role: 'WRITE' | 'READ'
  }) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const success = await inviteUser(data.email)
      if (success) {
        toast.success(`Successfully invited ${data.email}`)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send invitation'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="p-4" aria-label="Invite team members">
      <InvitationForm onSubmit={handleInviteMember} />
    </section>
  )
}
