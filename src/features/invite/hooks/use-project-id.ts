import { useParams } from 'next/navigation'

/**
 * 프로젝트 ID를 가져오는 공통 훅
 * URL 파라미터에서 projectId를 추출하고 타입 안전성을 보장합니다.
 */
export function useProjectId(): number {
  const params = useParams()
  const projectId = Number(params.projectId)

  if (Number.isNaN(projectId)) {
    throw new Error('Invalid project ID')
  }

  return projectId
}
