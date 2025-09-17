'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useMembers } from '../hooks/use-invitations'
import { useProjectId } from '../hooks/use-project-id'
import type { ProjectRole } from '../types/invite-types'
import { MemberList } from './member-list'

export default function MembersPanel() {
  const projectId = useProjectId()

  const {
    members,
    isLoading,
    canManageMembers,
    fetchMembers,
    fetchMyRole,
    updateMemberRole,
    removeMember,
  } = useMembers({ projectId })

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchMembers(), fetchMyRole()])
      } catch {
        toast.error('Failed to load member data')
      }
    }

    loadData()
  }, [fetchMembers, fetchMyRole])

  const handleRoleChange = useCallback(
    async (memberId: number, newRole: ProjectRole) => {
      try {
        await updateMemberRole(memberId, { role: newRole })
        toast.success('Member role updated successfully')
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update member role'
        toast.error(errorMessage)
      }
    },
    [updateMemberRole],
  )

  const handleRemoveMember = useCallback(
    async (memberId: number) => {
      try {
        await removeMember(memberId)
        toast.success('Member removed successfully')
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to remove member'
        toast.error(errorMessage)
      }
    },
    [removeMember],
  )

  // 현재 사용자 ID를 안전하게 가져오기 (실제 구현에서는 인증 시스템에서 가져와야 함)
  const currentUserId = useMemo(() => {
    // TODO: 실제 사용자 ID로 교체 (예: useAuth 훅에서 가져오기)
    return 1
  }, [])

  // 멤버 수 계산
  const memberCount = useMemo(() => members.length, [members.length])

  return (
    <section className="p-4" aria-label="Project members">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-muted-foreground text-sm">
          Members ({memberCount})
        </h3>
        {isLoading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
      </div>

      <MemberList
        members={members}
        isLoading={isLoading}
        onRoleChange={handleRoleChange}
        onRemove={handleRemoveMember}
        canManage={canManageMembers}
        currentUserId={currentUserId}
      />
    </section>
  )
}
