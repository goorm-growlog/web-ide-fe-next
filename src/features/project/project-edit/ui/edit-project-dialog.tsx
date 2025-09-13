'use client'

import { useState } from 'react'
import { updateProject } from '@/entities/project/api/project'
import type { Project } from '@/entities/project/model/types'
import type { CreateProjectFormData } from '@/features/project/project-create/model/validation'
import { CreateProjectForm } from '@/features/project/project-create/ui/create-project-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog'

interface EditProjectDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: EditProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: CreateProjectFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await updateProject(project.projectId, {
        projectName: data.projectName,
        ...(data.description && { description: data.description }),
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader className="mb-4 pt-2">
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your project information.
          </DialogDescription>
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
          defaultValues={{
            projectName: project.projectName,
            description: project.description || '',
          }}
          submitButtonText={isLoading ? 'Updating...' : 'Update Project'}
        />
      </DialogContent>
    </Dialog>
  )
}
