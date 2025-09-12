'use client'

import { useRouter } from 'next/navigation'
import { ProjectListWidget } from '@/widgets/project/ui/project-list-widget'
import { useUnifiedProjects } from '@/features/project/project-list/model/use-unified-projects'
import { MainHeader } from '@/widgets/header/ui/main-header'
import { ProjectListSkeleton } from '@/entities/project'
import type { ProjectAction, Project } from '@/entities/project'

export default function ProjectPage() {
  const { 
    ownProjects, 
    joinedProjects, 
    isLoading, 
    error, 
    refetch 
  } = useUnifiedProjects()

  const router = useRouter()

  const handleProjectClick = (projectId: number) => {
    router.push(`/project/${projectId}`)
  }

  const handleProjectSelect = (project: Project) => {
    router.push(`/project/${project.projectId}`)
  }

  const handleProjectAction = (_projectId: number, _action: ProjectAction) => {
    // Handle project action
  }

  const handleProjectCreated = (_projectId: string) => {
    refetch()
  }

  const renderContent = () => {
    if (isLoading) return <ProjectListSkeleton />
    if (error) return <div className="text-destructive">Error: {error}</div>
    
    return (
      <div className="w-full max-w-[844px]">
        <ProjectListWidget
          hostProjects={ownProjects}
          invitedProjects={joinedProjects}
          onProjectClick={handleProjectClick}
          onProjectAction={handleProjectAction}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    )
  }

  return (
    <>
      <MainHeader />
      <main className="fixed inset-0 flex items-center justify-center bg-white">
        {renderContent()}
      </main>
    </>
  )
}