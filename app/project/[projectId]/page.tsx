'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authApi } from '@/shared/api/ky-client'
import { getProject } from '@/entities/project/api/project'
import { isProjectActive, isProjectInactive } from '@/entities/project'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const hasProcessedRef = useRef(false) // useRef로 중복 실행 방지
  const projectId = Number(params.projectId)

  useEffect(() => {
    // 이미 처리했거나 projectId가 없으면 실행하지 않음
    if (hasProcessedRef.current || !projectId) return

    const handleProjectAccess = async () => {
      try {
        hasProcessedRef.current = true // 처리 시작 시 즉시 플래그 설정
        setIsLoading(true)
        
        console.log(`[프로젝트 접근] 시작 - projectId: ${projectId}`)
        
        // 1단계: 프로젝트 정보 조회
        const project = await getProject(projectId)
        console.log('[프로젝트 정보]:', project)
        
        // 2단계: 상태에 따른 분기 처리
        if (isProjectActive(project)) {
          // ACTIVE 프로젝트: 바로 접근 (openProject 호출 불필요)
          console.log('[프로젝트 접근] ACTIVE 프로젝트 - 바로 진입')
          // 토스트 제거: 프로젝트 리스트에서 접근 시 중복 방지
          
        } else if (isProjectInactive(project)) {
          // INACTIVE 프로젝트: openProject API 호출 필요
          console.log('[프로젝트 접근] INACTIVE 프로젝트 - 활성화 시도')
          
          const response = await authApi.post(`projects/${projectId}/open`).json()
          console.log('[프로젝트 활성화] 성공:', response)
          toast.success('Project has been activated')
          
        } else {
          // DELETING 프로젝트
          toast.error('Project is being deleted')
          router.push('/project')
          return
        }
        
        // TODO: 실제 IDE 컴포넌트 렌더링
        
      } catch (error: any) {
        console.error('[프로젝트 접근] 실패:', error)
        console.error('[에러 상세]:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message
        })
        
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