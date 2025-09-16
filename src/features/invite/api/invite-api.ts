import { authApi } from '@/shared/api/ky-client'
import type {
  ApiResponse,
  InviteMemberRequest,
  Member,
  UpdateMemberRoleRequest,
} from '../types/invite-types'

/**
 * 멤버 관리 관련 API 함수들 - 실제 API 문서 기반
 */
export const memberApi = {
  /**
   * 프로젝트 멤버 목록 조회
   * GET /api/projects/{projectId}/members
   */
  async getMembers(projectId: number): Promise<ApiResponse<Member[]>> {
    return authApi.get(`/api/projects/${projectId}/members`).json()
  },

  /**
   * 프로젝트 멤버 초대 (API 스펙: emails 배열)
   * POST /api/projects/{projectId}/invite
   */
  async inviteMember(
    projectId: number,
    data: InviteMemberRequest,
  ): Promise<ApiResponse<string[]>> {
    return authApi
      .post(`/api/projects/${projectId}/invite`, {
        json: data,
      })
      .json()
  },

  /**
   * 멤버 역할 변경
   * PATCH /api/projects/{projectId}/members/{userId}
   */
  async updateMemberRole(
    projectId: number,
    userId: number,
    data: UpdateMemberRoleRequest,
  ): Promise<ApiResponse<string>> {
    return authApi
      .patch(`/api/projects/${projectId}/members/${userId}`, {
        json: data,
      })
      .json()
  },

  /**
   * 멤버 제거 (소유자만 가능)
   * DELETE /api/projects/{projectId}/members/{userId}
   */
  async removeMember(
    projectId: number,
    userId: number,
  ): Promise<ApiResponse<string>> {
    return authApi.delete(`/api/projects/${projectId}/members/${userId}`).json()
  },

  /**
   * 내 역할 조회
   * GET /api/projects/{projectId}/permissions/me
   */
  async getMyRole(projectId: number): Promise<ApiResponse<{ role: string }>> {
    return authApi.get(`/api/projects/${projectId}/permissions/me`).json()
  },
}
