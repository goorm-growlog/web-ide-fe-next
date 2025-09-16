'use client'

import { ChevronRight, UsersIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useInviteUser, useMembers } from '../hooks/use-invitations'
import type { ProjectRole } from '../types/invite-types'
import { InvitationForm } from './invitation-form'
import { MemberList } from './member-list'

export default function InvitePanel() {
  const params = useParams()
  const projectId = Number(params.projectId)
  const [membersExpanded, setMembersExpanded] = useState(true)

  const {
    members,
    isLoading,
    canManageMembers,
    fetchMembers,
    fetchMyRole,
    updateMemberRole,
    removeMember,
  } = useMembers({ projectId })

  const { inviteUser } = useInviteUser({ projectId })

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchMembers()
    fetchMyRole()
  }, [fetchMembers, fetchMyRole])

  const handleInviteMember = async (data: {
    email: string
    role: 'WRITE' | 'READ'
  }) => {
    try {
      await inviteUser(data.email)
      await fetchMembers()
    } catch {
      // 에러는 훅에서 처리됨
    }
  }

  const handleRoleChange = async (memberId: number, newRole: ProjectRole) => {
    try {
      await updateMemberRole(memberId, { role: newRole })
    } catch {
      // 에러는 훅에서 처리됨
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    try {
      await removeMember(memberId)
    } catch {
      // 에러는 훅에서 처리됨
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Invitations Section - No Header */}
      <div className="border-b p-2">
        <InvitationForm onSubmit={handleInviteMember} />
      </div>

      {/* Members Panel - Toggleable */}
      <div className="flex min-h-0 flex-1 flex-col">
        <button
          className="flex w-full cursor-pointer items-center justify-between gap-1.5 border-[var(--color-border)] border-y bg-transparent px-3 py-2 font-medium text-[var(--color-foreground)] text-sm hover:bg-[var(--color-muted)]"
          onClick={() => setMembersExpanded(!membersExpanded)}
          type="button"
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <ChevronRight
              className={`h-4 w-4 transition-transform duration-300 ${
                membersExpanded ? 'rotate-90' : ''
              }`}
            />
            <UsersIcon className="h-4 w-4" />
            <span className="truncate text-left uppercase">members</span>
            {members.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-[var(--color-primary-foreground)] text-xs">
                {members.length}
              </span>
            )}
          </div>
        </button>
        {membersExpanded && (
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <MemberList
              members={members}
              isLoading={isLoading}
              onRoleChange={handleRoleChange}
              onRemove={handleRemoveMember}
              canManage={canManageMembers}
              currentUserId={1} // TODO: 실제 사용자 ID로 교체
            />
          </div>
        )}
      </div>
    </div>
  )
}
