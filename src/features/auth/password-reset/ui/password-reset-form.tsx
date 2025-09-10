import { FormProvider } from 'react-hook-form'
import { usePasswordResetForm } from '@/features/auth/password-reset/model/use-password-reset-form'
import FormField from '@/shared/ui/form-field'
import { Input } from '@/shared/ui/shadcn'
import type { PasswordResetData } from '../model/schema'

interface PasswordResetFormProps {
  onSubmit: (data: PasswordResetData) => Promise<void>
  children?: React.ReactNode // DialogFooter를 위한 children
}

const PasswordResetForm = ({ onSubmit, children }: PasswordResetFormProps) => {
  const { form, handleSubmit } = usePasswordResetForm({ onSubmit })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        id="password-reset-form"
      >
        <FormField name="name" control={form.control} label="Name">
          {field => <Input {...field} placeholder="Enter your name" />}
        </FormField>
        <FormField name="email" control={form.control} label="Email">
          {field => (
            <Input {...field} type="email" placeholder="Enter your email" />
          )}
        </FormField>

        {children}
      </form>
    </FormProvider>
  )
}

export default PasswordResetForm
