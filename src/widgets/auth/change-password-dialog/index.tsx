// FormProvider는 아래에서 함께 import하므로 중복 제거
// 실제 구현 시 아래 훅은 별도 파일로 분리 필요
import { FormProvider, useForm } from 'react-hook-form'
import EmailVerificationForm from '@/features/auth/email-verification/ui/email-verification-form'
import FormField from '@/features/auth/ui/form-field'
import PasswordInput from '@/features/auth/ui/password-input'
import { Button } from '@/shared/ui/shadcn/button'
import { Dialog, DialogContent } from '@/shared/ui/shadcn/dialog'
import styles from './change-password-dialog.module.css'

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    email: string
    code: string
    password: string
  }) => Promise<void>
  isLoading?: boolean
}

const ChangePasswordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ChangePasswordDialogProps) => {
  // 실제 구현 시 별도 model/use-change-password-form.ts로 분리 필요
  const form = useForm<{ email: string; code: string; password: string }>({
    defaultValues: { email: '', code: '', password: '' },
    mode: 'onChange',
  })

  const handleSubmit = form.handleSubmit(async data => {
    await onSubmit(data)
    form.reset()
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className={styles.dialogTitle}>Forgot Password?</div>
        <div className={styles.dialogDescription}>
          Once deleted, the data cannot be recovered.
        </div>
        <FormProvider {...form}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <EmailVerificationForm />
            <FormField
              name="password"
              control={form.control}
              label="새 비밀번호"
            >
              {field => <PasswordInput {...field} />}
            </FormField>
            <div className={styles.buttonRow}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting || isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isLoading}
              >
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordDialog
