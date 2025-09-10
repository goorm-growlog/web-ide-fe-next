'use client'

import { useRouter } from 'next/navigation'
import { ProjectListWidget } from '@/widgets/project/ui/project-list-widget'
import { useProjectList } from '@/features/project/project-list/model/use-project-list'
import { MainHeader } from '@/widgets/header/ui/main-header'
import { ProjectListSkeleton } from '@/entities/project'

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
  }

  const handleProjectCreated = (projectId: string) => {
    console.log('Project created:', projectId)
    refetch()
  }

  const handleViewAllHost = () => {
    console.log('View all host projects')
  }

  const handleViewAllInvited = () => {
    console.log('View all invited projects')
  }

  const renderContent = () => {
    if (isLoading) return <ProjectListSkeleton />
    if (error) return <div className="text-destructive">Error: {error}</div>
    
    return (
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