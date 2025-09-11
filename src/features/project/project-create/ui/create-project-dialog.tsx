'use client'

import { useCreateProject } from '@/features/project/project-create/model/use-create-project'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog'
import type { CreateProjectFormData } from '../model/validation'
import { CreateProjectForm } from './create-project-form'

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (projectId: string) => void
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateProjectDialogProps) {
  const { createProject, isLoading, error } = useCreateProject()

  const handleSubmit = async (data: CreateProjectFormData) => {
    const projectData = {
      projectName: data.projectName,
      ...(data.description && { description: data.description }),
    }

    const result = await createProject(projectData)

    if (result.success && result.projectId) {
      onOpenChange(false)
      onSuccess?.(result.projectId)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader className="mb-4 pt-2">
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Create a new project.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <CreateProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
