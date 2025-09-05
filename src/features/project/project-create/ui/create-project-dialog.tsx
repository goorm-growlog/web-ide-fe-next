'use client'

import { useCreateProject } from '@/features/project/project-create/model/use-create-project'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog'
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

  const handleSubmit = async (data: { name: string; description: string }) => {
    const projectData = {
      name: data.name,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 프로젝트 만들기</DialogTitle>
          <DialogDescription>
            새로운 프로젝트를 만들어 협업을 시작해보세요.
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
        />
      </DialogContent>
    </Dialog>
  )
}
