// 프로젝트 엔티티 유틸리티 함수들 (Legacy 호환성 유지)

import type { Project } from '@/entities/project/model/types'

/**
 * 프로젝트 목록을 타입별로 조회하고 멤버 정보를 추가하는 비즈니스 로직
 */
export async function getEnrichedProjectsByType(config?: {
  maxHostProjects?: number
  maxInvitedProjects?: number
}): Promise<{
  hostProjects: Project[]
  invitedProjects: Project[]
}> {
  const { getProjects } = await import('../api/project')
  const { maxHostProjects, maxInvitedProjects } = config || {}

  // 1단계: 기본 프로젝트 정보 조회 (병렬)
  const [allHostProjects, allInvitedProjects] = await Promise.all([
    getProjects('own'),
    getProjects('joined'),
  ])

  // 2단계: 제한된 개수만 선별 (매개변수로 제어 가능)
  const displayHostProjects = maxHostProjects
    ? allHostProjects.slice(0, maxHostProjects)
    : allHostProjects
  const displayInvitedProjects = maxInvitedProjects
    ? allInvitedProjects.slice(0, maxInvitedProjects)
    : allInvitedProjects

  // 3단계: 선별된 프로젝트만 멤버 정보 조회
  const [enrichedHostProjects, enrichedInvitedProjects] = await Promise.all([
    enrichProjectsWithMembers(displayHostProjects),
    enrichProjectsWithMembers(displayInvitedProjects),
  ])

  return {
    hostProjects: enrichedHostProjects,
    invitedProjects: enrichedInvitedProjects,
  }
}

/**
 * 프로젝트와 멤버 정보를 결합하는 비즈니스 로직
 */
async function enrichProjectWithMembers(project: Project): Promise<Project> {
  try {
    const { getProjectMembers } = await import('../api/project')
    const memberProfiles = await getProjectMembers(project.projectId)
    return { ...project, memberProfiles }
  } catch {
    return project // 실패시 기본 정보만 반환
  }
}

/**
 * 여러 프로젝트에 멤버 정보를 병렬로 추가
 */
async function enrichProjectsWithMembers(
  projects: Project[],
): Promise<Project[]> {
  return Promise.all(projects.map(enrichProjectWithMembers))
}

// --- Moved from features/project/model/project-members.ts ---

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
