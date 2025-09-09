// 프로젝트 비즈니스 로직 서비스
// FSD Model 레이어: 순수 비즈니스 로직만 포함

import { getProjectMembers, getProjects } from '../api/project-api'
import type { Project } from './types'

/**
 * 프로젝트와 멤버 정보를 결합하는 비즈니스 로직
 * @param project - 기본 프로젝트 정보
 * @returns 멤버 정보가 포함된 프로젝트
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
 * @param projects - 기본 프로젝트 목록
 * @returns 멤버 정보가 포함된 프로젝트 목록
 */
async function enrichProjectsWithMembers(
  projects: Project[],
): Promise<Project[]> {
  return Promise.all(projects.map(enrichProjectWithMembers))
}

/**
 * 프로젝트 목록을 타입별로 조회하고 표시할 프로젝트만 멤버 정보를 추가하는 비즈니스 로직
 * @returns 타입별로 분류된 프로젝트 목록 (표시할 프로젝트만 멤버 정보 포함)
 */
export async function getEnrichedProjectsByType(): Promise<{
  hostProjects: Project[]
  invitedProjects: Project[]
}> {
  // 1단계: 기본 프로젝트 정보 조회 (병렬)
  const [allHostProjects, allInvitedProjects] = await Promise.all([
    getProjects('own'),
    getProjects('joined'),
  ])

  // 2단계: 표시할 프로젝트만 선별 (UI에서 실제로 보여줄 개수만)
  const displayHostProjects = allHostProjects.slice(0, 3)
  const displayInvitedProjects = allInvitedProjects.slice(0, 4)

  // 3단계: 선별된 프로젝트만 멤버 정보 조회 (API 호출 최소화)
  const [enrichedHostProjects, enrichedInvitedProjects] = await Promise.all([
    enrichProjectsWithMembers(displayHostProjects),
    enrichProjectsWithMembers(displayInvitedProjects),
  ])

  return {
    hostProjects: enrichedHostProjects,
    invitedProjects: enrichedInvitedProjects,
  }
}
