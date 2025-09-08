'use client'

import { ProjectListWidget } from '@/widgets/project/ui/project-list-widget'
import { useProjectList } from '@/features/project/project-list/model/use-project-list'
import { useLogout } from '@/features/auth/logout/model/use-logout'
import { Button } from '@/shared/ui/shadcn/button'
import { useRouter } from 'next/navigation'

export default function ProjectPage() {
  const {
    hostProjects,
    invitedProjects,
    totalHost,
    totalInvited,
    isLoading,
    error
  } = useProjectList()
  
  const router = useRouter()
  const { logout } = useLogout()

  const handleProjectClick = (projectId: number) => {
    router.push(`/project/${projectId}`)
  }

  const handleProjectAction = (projectId: number, action: string) => {
    console.log('Project action:', { projectId, action })
    // TODO: 실제 액션 구현
  }

  const handleLogout = () => {
    logout()
  }

  const handleViewAllHost = () => {
    console.log('View all host projects')
    // TODO: 모달 또는 페이지 이동
  }

  const handleViewAllInvited = () => {
    console.log('View all invited projects')
    // TODO: 모달 또는 페이지 이동
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-foreground">Loading projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-destructive">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-[844px]">
        {/* 임시 로그아웃 버튼 */}
        <div className="mb-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-sm"
          >
            로그아웃
          </Button>
        </div>
        
        <ProjectListWidget
          hostProjects={hostProjects}
          invitedProjects={invitedProjects}
          totalHost={totalHost}
          totalInvited={totalInvited}
          onProjectClick={handleProjectClick}
          onProjectAction={handleProjectAction}
          onViewAllHost={handleViewAllHost}
          onViewAllInvited={handleViewAllInvited}
        />
      </div>
    </div>
  )
}
