'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  type CreateProjectFormData,
  createProjectSchema,
} from '@/features/project/project-create/model/validation'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Textarea } from '@/shared/ui/shadcn/textarea'

interface CreateProjectFormProps {
  onSubmit: (data: CreateProjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
  defaultValues?: Partial<CreateProjectFormData>
  submitButtonText?: string
}

export function CreateProjectForm({
  onSubmit,
  onCancel,
  isLoading,
  defaultValues,
  submitButtonText,
}: CreateProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: defaultValues?.projectName || '',
      description: defaultValues?.description || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          placeholder="Enter project name"
          {...register('projectName')}
        />
        {errors.projectName && (
          <p className="text-destructive text-sm">
            {errors.projectName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter project description"
          rows={3}
          className="resize-none"
          style={
            {
              fieldSizing: 'fixed',
              scrollbarWidth: 'thin',
              scrollbarColor: 'hsl(var(--muted-foreground) / 0.3) transparent',
            } as React.CSSProperties
          }
          {...register('description')}
        />
        {errors.description && (
          <p className="text-destructive text-sm">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {submitButtonText || (isLoading ? 'Creating...' : 'Create Project')}
        </Button>
      </div>
    </form>
  )
}
