'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Textarea } from '@/shared/ui/shadcn/textarea'
import {
  type CreateProjectFormData,
  createProjectSchema,
} from '../model/validation'

interface CreateProjectFormProps {
  onSubmit: (data: CreateProjectFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function CreateProjectForm({
  onSubmit,
  onCancel,
  isLoading,
}: CreateProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          placeholder="Enter project name"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <div className="w-full overflow-hidden">
          <Textarea
            id="description"
            placeholder="Enter project description"
            rows={3}
            className="!max-w-full w-full resize-none"
            style={
              {
                fieldSizing: 'fixed',
              } as React.CSSProperties
            }
            {...register('description')}
          />
        </div>
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
          {isLoading ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}
