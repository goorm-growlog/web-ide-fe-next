'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authApi } from '@/shared/api/ky-client'
import { getProject } from '@/entities/project/api/project'
import { isProjectActive, isProjectInactive } from '@/entities/project'
import { useUnifiedProjects } from '@/features/project/project-list/model/use-unified-projects'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const hasProcessedRef = useRef(false) // useRef로 중복 실행 방지
  const { refetch } = useUnifiedProjects() // 캐시 무효화를 위한 refetch 함수
  const projectId = Number(params.projectId)

  useEffect(() => {
    // 이미 처리했거나 projectId가 없으면 실행하지 않음
    if (hasProcessedRef.current || !projectId) return

    const handleProjectAccess = async () => {
      try {
        hasProcessedRef.current = true // 처리 시작 시 즉시 플래그 설정
        setIsLoading(true)
        
        // 1단계: 프로젝트 정보 조회
        const project = await getProject(projectId)
        
        // 2단계: 상태에 따른 분기 처리
        if (isProjectActive(project)) {
          // ACTIVE 프로젝트: 바로 접근 (openProject 호출 불필요)
          // 토스트 제거: 프로젝트 리스트에서 접근 시 중복 방지
          
        } else if (isProjectInactive(project)) {
          // INACTIVE 프로젝트: openProject API 호출 필요
          
          const response = await authApi.post(`/projects/${projectId}/open`).json()
          toast.success('Project has been activated')
          
          // 프로젝트 상태가 변경되었으므로 캐시 무효화
          refetch()
          
        } else {
          // DELETING 프로젝트
          toast.error('Project is being deleted')
          router.push('/project')
          return
        }
        
        // TODO: 실제 IDE 컴포넌트 렌더링
        
      } catch (error: any) {
        // 에러 상세 처리
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
    }

    handleProjectAccess()
  }, [projectId, router]) // useRef는 의존성에서 제외

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        {isLoading ? (
          <>
            <h1 className="text-2xl font-bold">Loading Project {projectId}...</h1>
            <p className="text-muted-foreground">Preparing your project.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Project {projectId}</h1>
            <p className="text-muted-foreground">IDE component will be displayed here.</p>
          </>
        )}
      </div>
    </div>
  )
}