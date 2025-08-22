import type { UseFormReturn } from 'react-hook-form'
import FormField from '@/features/auth/ui/form-field'
import PasswordInput from '@/features/auth/ui/password-input'
import { Button } from '@/shared/ui/shadcn/button'
import { Form } from '@/shared/ui/shadcn/form'
import type { LoginFormData } from '../model/use-login-form'

interface LoginFormProps {
  form: UseFormReturn<LoginFormData>
  isLoading: boolean
  onSubmit: (data: LoginFormData) => Promise<void>
  onPasswordResetClick: () => void
}

const LoginForm = ({
  form,
  isLoading,
  onSubmit,
  onPasswordResetClick,
}: LoginFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
        />
        <FormField control={form.control} name="password" label="Password">
          {field => (
            <PasswordInput {...field} placeholder="Enter your password" />
          )}
        </FormField>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'login'}
        </Button>
      </form>
      <div className="flex justify-end mt-1">
        <button
          type="button"
          onClick={onPasswordResetClick}
          className="text-sm text-gray-500 hover:underline hover:text-gray-700 transition"
        >
          Forgot your password?
        </button>
      </div>
    </Form>
  )
}

export default LoginForm
