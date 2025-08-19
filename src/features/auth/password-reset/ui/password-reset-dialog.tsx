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
  const handleOpenChange = (val: boolean) => {
    if (isLoading) return
    onOpenChange(val)
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[440px] max-w-[85vw]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>receive a temporary password.</DialogDescription>
        </DialogHeader>

        <PasswordResetForm onSubmit={onSubmit}>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="password-reset-form"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Send Password'}
            </Button>
          </DialogFooter>
        </PasswordResetForm>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordResetDialog
