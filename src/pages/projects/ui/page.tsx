// src/app/project/[projectId]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { ProjectEditorWidget } from '@/widgets/project-editor'

const ProjectPage = () => {
  const params = useParams()
  const projectId = params?.projectId as string

  return <ProjectEditorWidget projectId={projectId} />
}

export default ProjectPage
