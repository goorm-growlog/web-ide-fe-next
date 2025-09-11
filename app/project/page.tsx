'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectListWidget } from '@/widgets/project/ui/project-list-widget'
import { useOwnProjects, useJoinedProjects, ProjectListModal } from '@/features/project/project-list'
import { MainHeader } from '@/widgets/header/ui/main-header'
import { ProjectListSkeleton } from '@/entities/project'
import type { ProjectAction, Project } from '@/entities/project'
import { Button } from '@/shared/ui/shadcn/button'

export default function ProjectPage() {
  const { projects: ownProjects, isLoading: isLoadingOwnProjects, error: ownError, refetch: refetchOwnProjects } = useOwnProjects()
  const { projects: joinedProjects, isLoading: isLoadingJoinedProjects, error: joinedError, refetch: refetchJoinedProjects } = useJoinedProjects()
  
  const isLoading = isLoadingOwnProjects || isLoadingJoinedProjects
  const error = ownError || joinedError
  
  const refetch = () => {
    refetchOwnProjects()
    refetchJoinedProjects()
  }

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

  // View All 버튼들을 위한 핸들러는 제거 (이제 Modal 컴포넌트가 trigger로 처리)

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