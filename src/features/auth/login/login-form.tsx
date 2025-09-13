import type { UseFormReturn } from 'react-hook-form'
import type { LoginFormData } from '@/features/auth/lib/validation'
import FormField from '@/shared/ui/form-field'
import PasswordInput from '@/shared/ui/password-input'
import { Button } from '@/shared/ui/shadcn/button'
import { Form } from '@/shared/ui/shadcn/form'

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
          className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onPasswordResetClick}
          className="text-muted-foreground text-xs transition hover:text-muted-foreground/80 hover:underline"
        >
          Forgot your password?
        </button>
      </div>
    </Form>
  )
}

export default LoginForm
