// 프로젝트 엔티티 비즈니스 로직 서비스

import { getProjectMembers, getProjects } from '../api/project'
import type { Project } from './types'

/**
 * 프로젝트와 멤버 정보를 결합하는 비즈니스 로직
 */
async function enrichProjectWithMembers(project: Project): Promise<Project> {
  try {
    const memberProfiles = await getProjectMembers(project.projectId)
    return { ...project, memberProfiles }
  } catch (error) {
    console.warn(
      `Failed to fetch members for project ${project.projectId}:`,
      error,
    )
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
