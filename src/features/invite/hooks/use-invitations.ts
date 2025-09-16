'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { memberApi } from '../api/invite-api'
import type {
  Member,
  ProjectRole,
  UpdateMemberRoleRequest,
} from '../types/invite-types'

interface UseInviteUserOptions {
  projectId: number
}

export function useInviteUser({ projectId }: UseInviteUserOptions) {
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 멤버 초대 (API 스펙에 맞게 emails 배열로 수정)
   */
  const inviteUser = useCallback(
    async (email: string) => {
      setIsLoading(true)
      try {
        // API 스펙에 맞게 emails 배열로 전송
        const response = await memberApi.inviteMember(projectId, {
          emails: [email],
        })

        if (response.success) {
          toast.success('Invitation sent successfully.')
          return true
        } else {
          throw new Error(
            response.error?.message || 'Failed to send invitation',
          )
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to send invitation.'
        toast.error(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [projectId],
  )

  /**
   * 여러 이메일 동시 초대 (새로운 기능 추가)
   */
  const inviteMultipleUsers = useCallback(
    async (emails: string[]) => {
      if (emails.length === 0) return

      setIsLoading(true)
      try {
        const response = await memberApi.inviteMember(projectId, { emails })

        if (response.success) {
          toast.success(`Invitations sent to ${emails.length} member(s).`)
          return true
        } else {
          throw new Error(
            response.error?.message || 'Failed to send invitations',
          )
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to send invitations.'
        toast.error(errorMessage)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [projectId],
  )

  return {
    inviteUser,
    inviteMultipleUsers,
    isLoading,
  }
}

/**
 * 멤버 목록 관리용 훅 (필요시 사용)
 */
export function useMembers({ projectId }: { projectId: number }) {
  const [members, setMembers] = useState<Member[]>([])
  const [myRole, setMyRole] = useState<ProjectRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 멤버 목록 조회 - 수동 호출
   */
  const fetchMembers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await memberApi.getMembers(projectId)

      if (response.success) {
        setMembers(response.data)
      } else {
        throw new Error(response.error?.message || 'Failed to fetch members')
      }
    } catch (error) {
      console.error('Failed to fetch members:', error)
      toast.error('Failed to load member list.')
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  /**
   * 내 역할 조회 - 수동 호출
   */
  const fetchMyRole = useCallback(async () => {
    try {
      const response = await memberApi.getMyRole(projectId)

      if (response.success) {
        setMyRole(response.data.role as ProjectRole)
      } else {
        throw new Error(response.error?.message || 'Failed to fetch role')
      }
    } catch (error) {
      console.error('Failed to fetch my role:', error)
    }
  }, [projectId])

  /**
   * 멤버 역할 변경
   */
  const updateMemberRole = useCallback(
    async (memberId: number, data: UpdateMemberRoleRequest) => {
      try {
        const response = await memberApi.updateMemberRole(
          projectId,
          memberId,
          data,
        )

        if (response.success) {
          // 로컬 상태 업데이트
          setMembers(prev =>
            prev.map(member =>
              member.userId === memberId
                ? { ...member, role: data.role }
                : member,
            ),
          )
          toast.success('Member role updated successfully.')
        } else {
          throw new Error(response.error?.message || 'Failed to update role')
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update member role.'
        toast.error(errorMessage)
        throw error
      }
    },
    [projectId],
  )

  /**
   * 멤버 제거
   */
  const removeMember = useCallback(
    async (memberId: number) => {
      try {
        const response = await memberApi.removeMember(projectId, memberId)

        if (response.success) {
          setMembers(prev => prev.filter(member => member.userId !== memberId))
          toast.success('Member removed successfully.')
        } else {
          throw new Error(response.error?.message || 'Failed to remove member')
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to remove member.'
        toast.error(errorMessage)
        throw error
      }
    },
    [projectId],
  )

  /**
   * 권한 확인 헬퍼
   */
  const canManageMembers = myRole === 'OWNER'
  const canInviteMembers = myRole === 'OWNER'

  return {
    members,
    myRole,
    isLoading,
    canManageMembers,
    canInviteMembers,
    fetchMembers,
    fetchMyRole,
    updateMemberRole,
    removeMember,
  }
}
