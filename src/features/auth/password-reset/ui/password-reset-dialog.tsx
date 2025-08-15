import FormField from '@/features/auth/ui/form-field'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog'
import { Form } from '@/shared/ui/shadcn/form'
import {
  type PasswordResetData,
  usePasswordResetForm,
} from '../model/use-password-reset-form'

interface PasswordResetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PasswordResetData) => Promise<void>
  isLoading?: boolean
}

const PasswordResetDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: PasswordResetDialogProps) => {
  const form = usePasswordResetForm({ onSubmit })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Enter your name and email to receive a temporary password.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              label="Name"
              placeholder="Enter your name"
            />
            <FormField
              name="email"
              control={form.control}
              label="Email"
              type="email"
              placeholder="Enter your email"
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || form.formState.isSubmitting}
              >
                {isLoading ? 'Processing...' : 'Send Temporary Password'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordResetDialog
