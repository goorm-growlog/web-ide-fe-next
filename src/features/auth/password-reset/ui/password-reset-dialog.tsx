import FormField from '@/features/auth/ui/form-field'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  const { form, handleSubmit } = usePasswordResetForm({ onSubmit })
  const isProcessing = isLoading || form.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your name and email to receive a temporary password.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            id="password-reset-form"
          >
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
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="password-reset-form"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Send Temporary Password'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordResetDialog
