// 프로젝트 권한 관련 비즈니스 로직

import type { OwnerOnlyAction, Project, ProjectAction } from './types'

/**
 * 사용자가 OWNER 권한을 가지고 있는지 확인
 */
export function isProjectOwner(project: Project): boolean {
  return project.myRole === 'OWNER'
}

/**
 * 프로젝트가 활성 상태인지 확인
 */
export function isProjectActive(project: Project): boolean {
  return project.status === 'ACTIVE'
}

/**
 * 프로젝트가 삭제 중인지 확인
 */
export function isProjectDeleting(project: Project): boolean {
  return project.status === 'DELETING'
}

/**
 * 특정 액션이 OWNER 전용인지 확인
 */
export function isOwnerOnlyAction(
  action: ProjectAction,
): action is OwnerOnlyAction {
  const ownerOnlyActions: OwnerOnlyAction[] = ['edit', 'delete', 'inactivate']
  return ownerOnlyActions.includes(action as OwnerOnlyAction)
}

/**
 * 사용자가 특정 액션을 수행할 수 있는지 확인
 */
export function canPerformAction(
  project: Project,
  action: ProjectAction,
): boolean {
  // 삭제 중인 프로젝트는 어떤 액션도 불가
  if (isProjectDeleting(project)) {
    return false
  }

  // OWNER 전용 액션인 경우 OWNER 권한 필요
  if (isOwnerOnlyAction(action)) {
    return isProjectOwner(project)
  }

  // 기타 액션은 모든 멤버가 수행 가능
  return true
}

/**
 * 프로젝트 메뉴가 표시되어야 하는지 확인
 */
export function shouldShowProjectMenu(project: Project): boolean {
  return isProjectOwner(project) && !isProjectDeleting(project)
}

/**
 * 인액티베이트 액션이 가능한지 확인
 */
export function canInactivateProject(project: Project): boolean {
  return (
    isProjectOwner(project) &&
    isProjectActive(project) &&
    !isProjectDeleting(project)
  )
}
