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
 * 프로젝트 멤버 카운트를 계산합니다
 */
export function calculateMemberCount(project: Project): {
  visibleMembers: ProjectMember[]
  remainingCount: number
} {
  return getVisibleMembers(project.members, 3)
}

/**
 * 이벤트 전파를 방지하는 핸들러를 생성합니다
 */
export function createStopPropagationHandler<T extends () => void>(
  handler: T,
): (e: React.MouseEvent) => void {
  return (e: React.MouseEvent) => {
    e.stopPropagation()
    handler()
  }
}
