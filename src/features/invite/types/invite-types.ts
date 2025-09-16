/**
 * 초대 관련 타입 정의 - 실제 API 문서 기반
 */

// API 문서의 MemberDto 기반
export interface Member {
  userId: number
  name: string
  email: string
  profileImageUrl: string
  role: ProjectRole
}

// API 문서의 InviteMemberRequestDto 기반
export interface InviteMemberRequest {
  emails: string[] // API 스펙에 따라 emails 배열로 수정
}

// API 문서의 UpdateMemberRoleRequestDto 기반
export interface UpdateMemberRoleRequest {
  role: ProjectRole
  changingOwnerRole?: boolean
}

// API 응답 타입들
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: {
    code: string
    message: string
  }
}

export interface MemberListResponse {
  members: Member[]
}

// 프로젝트 역할 - API 문서의 enum 기반
export type ProjectRole = 'OWNER' | 'READ' | 'WRITE'

// 역할 변경 시 사용하는 타입
export interface RoleChangeRequest {
  memberId: number
  newRole: ProjectRole
  changingOwnerRole?: boolean
}

// 초대 관련 에러 타입
export interface InviteError {
  code: string
  message: string
  field?: string
}
