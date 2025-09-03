'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Textarea } from '@/shared/ui/shadcn/textarea'

interface FormData {
  name: string
  description: string
}

interface CreateProjectFormProps {
  onSubmit: (data: FormData) => void
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
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">프로젝트 이름</Label>
        <Input
          id="name"
          placeholder="프로젝트 이름을 입력해주세요"
          {...register('name', {
            required: '프로젝트 이름을 입력해주세요',
            maxLength: {
              value: 50,
              message: '프로젝트 이름은 50자 이하로 입력해주세요',
            },
          })}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명 (선택사항)</Label>
        <Textarea
          id="description"
          placeholder="프로젝트에 대한 설명을 입력해주세요"
          rows={3}
          {...register('description', {
            maxLength: {
              value: 100,
              message: '설명은 100자 이하로 입력해주세요',
            },
          })}
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
          취소
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '생성 중...' : '생성하기'}
        </Button>
      </div>
    </form>
  )
}
