import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  emailSchema,
  nameSchema,
} from '@/features/auth/model/validation-schema'

const passwordResetSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

export type PasswordResetData = z.infer<typeof passwordResetSchema>

interface UsePasswordResetFormOptions {
  onSubmit: (data: PasswordResetData) => Promise<void>
}

const usePasswordResetForm = ({ onSubmit }: UsePasswordResetFormOptions) => {
  const form = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      name: '',
      email: '',
    },
    mode: 'onChange',
  })

  const handleSubmit = form.handleSubmit(async data => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      // 에러 처리는 상위에서 담당
      throw error
    }
  })

  return {
    form,
    handleSubmit,
  }
}

export { usePasswordResetForm }
