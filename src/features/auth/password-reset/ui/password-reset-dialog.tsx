import type { PasswordResetData } from '@/features/auth/model/validation-schema'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog'
import PasswordResetForm from './password-reset-form'

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your name and email to receive a temporary password.
          </DialogDescription>
        </DialogHeader>

        <PasswordResetForm onSubmit={onSubmit}>
          <DialogFooter>
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
              form="password-reset-form"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Send Temporary Password'}
            </Button>
          </DialogFooter>
        </PasswordResetForm>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordResetDialog
