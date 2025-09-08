'use client'


import { useRouter } from 'next/navigation'
import { ProjectListWidget } from '@/widgets/project/ui/project-list-widget'
import { useProjectList } from '@/features/project/project-list/model/use-project-list'
import { MainHeader } from '@/widgets/header/ui/main-header'

export default function ProjectPage() {
  const {
    hostProjects,
    invitedProjects,
    isLoading,
    error,
    refetch
  } = useProjectList()
  
  const router = useRouter()

  const handleProjectClick = (projectId: number) => {
    router.push(`/project/${projectId}`)
  }

  const handleProjectAction = (projectId: number, action: string) => {
    console.log('Project action:', { projectId, action })
    // TODO: 실제 액션 구현 (edit, delete 등)
  }

  const handleProjectCreated = (projectId: string) => {
    console.log('Project created:', projectId)
    // 프로젝트 목록 새로고침
    refetch()
  }

  const handleViewAllHost = () => {
    console.log('View all host projects')
    // TODO: 모달 또는 페이지 이동
  }

  const handleViewAllInvited = () => {
    console.log('View all invited projects')
    // TODO: 모달 또는 페이지 이동
  }

  return (
    <>
      <MainHeader />
      <main className="flex min-h-screen items-center justify-center bg-white pt-[71px]">
        {isLoading ? (
          <div className="text-lg text-foreground">Loading projects...</div>
        ) : error ? (
          <div className="text-destructive">Error: {error}</div>
        ) : (
          <div className="w-full max-w-[844px]">
            <ProjectListWidget
              hostProjects={hostProjects}
              invitedProjects={invitedProjects}
              onProjectClick={handleProjectClick}
              onProjectAction={handleProjectAction}
              onViewAllHost={handleViewAllHost}
              onViewAllInvited={handleViewAllInvited}
              onProjectCreated={handleProjectCreated}
            />
          </div>
        )}
      </main>
    </>
  )
}
