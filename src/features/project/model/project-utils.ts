// 프로젝트 관련 유틸리티 함수들 (비즈니스 로직)

import type { Project, ProjectMember } from './types'

/**
 * 표시할 멤버 목록을 가져옵니다
 */
export function getVisibleMembers(
  members: ProjectMember[],
  maxCount: number = 3,
): {
  visibleMembers: ProjectMember[]
  remainingCount: number
} {
  const visibleMembers = members.slice(0, maxCount)
  const remainingCount = Math.max(0, members.length - maxCount)

  return { visibleMembers, remainingCount }
}

/**
 * 프로젝트 멤버 카운트를 계산합니다 (스마트 fallback 지원)
 */
export function calculateMemberCount(project: Project): {
  visibleMembers: Array<{ name: string; profileImageUrl?: string }>
  remainingCount: number
} {
  // memberProfiles가 있으면 사용 (상세 정보 포함)
  if (project.memberProfiles && project.memberProfiles.length > 0) {
    const visibleMembers = project.memberProfiles.slice(0, 3)
    const remainingCount = Math.max(0, project.memberProfiles.length - 3)
    return { visibleMembers, remainingCount }
  }

  // memberProfiles가 없으면 memberNames를 사용하여 fallback 객체 생성
  const fallbackMembers = project.memberNames.map(name => ({
    name,
    // profileImageUrl은 선택적 속성이므로 명시적으로 undefined를 설정하지 않음
  }))
  const visibleMembers = fallbackMembers.slice(0, 3)
  const remainingCount = Math.max(0, fallbackMembers.length - 3)

  return { visibleMembers, remainingCount }
}
