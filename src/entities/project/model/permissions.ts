// 프로젝트 권한 관련 비즈니스 로직 (단순화)

import type { OwnerOnlyAction, Project, ProjectAction } from './types'

/**
 * 사용자가 OWNER 권한을 가지고 있는지 확인
 */
export function isProjectOwner(project: Project): boolean {
  return project.myRole === 'OWNER'
}

/**
 * 프로젝트 상태 확인 함수들
 */
export function isProjectActive(project: Project): boolean {
  return project.status === 'ACTIVE'
}

export function isProjectInactive(project: Project): boolean {
  return project.status === 'INACTIVE'
}

export function isProjectDeleting(project: Project): boolean {
  return project.status === 'DELETING'
}

/**
 * 프로젝트 클릭 가능 여부 (단순한 룰)
 */
export function canClickProject(project: Project): boolean {
  // 삭제 중이면 클릭 불가
  if (isProjectDeleting(project)) {
    return false
  }

  // INACTIVE이고 오너가 아니면 클릭 불가
  if (isProjectInactive(project) && !isProjectOwner(project)) {
    return false
  }

  return true
}

/**
 * 프로젝트 상태 메시지 (간단한 룰)
 */
export function getProjectTooltip(project: Project): string | null {
  if (isProjectDeleting(project)) {
    return 'Project is being deleted'
  }

  if (isProjectInactive(project) && !isProjectOwner(project)) {
    return 'Inactive project. Only owner can access'
  }

  return null
}

/**
 * 액션 권한 확인 (기존 유지)
 */
export function isOwnerOnlyAction(
  action: ProjectAction,
): action is OwnerOnlyAction {
  const ownerOnlyActions: OwnerOnlyAction[] = ['edit', 'delete', 'inactivate']
  return ownerOnlyActions.includes(action as OwnerOnlyAction)
}

export function canPerformAction(
  project: Project,
  action: ProjectAction,
): boolean {
  if (isProjectDeleting(project)) {
    return false
  }

  if (isOwnerOnlyAction(action)) {
    return isProjectOwner(project)
  }

  return true
}

export function shouldShowProjectMenu(project: Project): boolean {
  return isProjectOwner(project) && !isProjectDeleting(project)
}

export function canInactivateProject(project: Project): boolean {
  return (
    isProjectOwner(project) &&
    isProjectActive(project) &&
    !isProjectDeleting(project)
  )
}
