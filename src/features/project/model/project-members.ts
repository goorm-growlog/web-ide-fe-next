// 프로젝트 멤버 관련 비즈니스 로직

import type { Project } from './types'

export interface MemberDisplayInfo {
  name: string
  profileImageUrl?: string
}

export interface MemberCountResult {
  visibleMembers: MemberDisplayInfo[]
  remainingCount: number
}

/**
 * 프로젝트 멤버 카운트를 계산합니다 (스마트 fallback 지원)
 * Model 레이어: 순수한 비즈니스 로직
 */
export function calculateMemberCount(
  project: Project,
  maxVisible: number = 3,
): MemberCountResult {
  // memberProfiles가 있으면 사용 (상세 정보 포함)
  if (project.memberProfiles && project.memberProfiles.length > 0) {
    const visibleMembers = project.memberProfiles.slice(0, maxVisible)
    const remainingCount = Math.max(
      0,
      project.memberProfiles.length - maxVisible,
    )
    return { visibleMembers, remainingCount }
  }

  // memberProfiles가 없으면 memberNames를 사용하여 fallback 객체 생성
  const fallbackMembers: MemberDisplayInfo[] = project.memberNames.map(
    name => ({
      name,
    }),
  )
  const visibleMembers = fallbackMembers.slice(0, maxVisible)
  const remainingCount = Math.max(0, fallbackMembers.length - maxVisible)

  return { visibleMembers, remainingCount }
}
