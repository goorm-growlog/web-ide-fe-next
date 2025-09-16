'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { authApi } from '@/shared/api/ky-client'
import { getProject } from '@/entities/project/api/project'
import { isProjectActive, isProjectInactive } from '@/entities/project/model/permissions'
import { useUnifiedProjects } from '@/features/project/project-list/model/use-unified-projects'
import { ProjectWorkspace } from '@/widgets/project/ui/project-workspace'


export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const hasProcessedRef = useRef(false)
  const { refetch } = useUnifiedProjects()
  const projectId = params.projectId as string

  // 프로젝트 접근 권한 확인
  const handleProjectAccess = useCallback(async () => {
    if (hasProcessedRef.current || !projectId || sessionStatus === 'loading') return
    
    if (sessionStatus === 'unauthenticated') {
      router.push('/signin')
      return
    }

    try {
      hasProcessedRef.current = true
      setIsLoading(true)

      const project = await getProject(Number(projectId))

      if (isProjectActive(project)) {
        // 이미 활성화된 프로젝트
      } else if (isProjectInactive(project)) {
        // 비활성화된 프로젝트 활성화
        await authApi.post(`/api/projects/${projectId}/open`).json()
        toast.success('Project has been activated')
        refetch()
      } else {
        // 삭제 중인 프로젝트
        toast.error('Project is being deleted')
        router.push('/project')
        return
      }

    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Inactive project can only be accessed by owner')
      } else if (error.response?.status === 404) {
        toast.error('Project not found')
      } else {
        toast.error('Cannot access project')
      }
      router.push('/project')
    } finally {
      setIsLoading(false)
    }
  }, [projectId, router, refetch, sessionStatus])

  useEffect(() => {
    handleProjectAccess()
  }, [handleProjectAccess])

  // 로딩 상태
  if (sessionStatus === 'loading' || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {sessionStatus === 'loading' ? 'Authenticating...' : `Loading Project ${projectId}...`}
          </h1>
          <p className="text-muted-foreground">
            {sessionStatus === 'loading' ? 'Checking your session.' : 'Preparing your project.'}
          </p>
        </div>
      </div>
    )
  }

  // 프로젝트 작업 공간 렌더링
  return <ProjectWorkspace projectId={projectId} />
}
