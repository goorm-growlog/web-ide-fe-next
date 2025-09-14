'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import FormField from '@/shared/ui/form-field'
import PasswordInput from '@/shared/ui/password-input'
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

const passwordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (password: string) => Promise<void>
  isSocialLogin: boolean
}

const DeleteAccountDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isSocialLogin,
}: DeleteAccountDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  })

  const handleConfirm = async (password = '') => {
    setIsLoading(true)
    try {
      await onConfirm(password)
      onOpenChange(false)
      form.reset()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete account',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            {isSocialLogin
              ? 'Are you sure you want to delete your account? This action cannot be undone.'
              : 'Please enter your password to confirm account deletion.'}
          </DialogDescription>
        </DialogHeader>

        {isSocialLogin ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <p className="font-medium text-destructive text-sm">
                This action is permanent and cannot be reversed.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleConfirm()}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(data => handleConfirm(data.password))}
              className="mt-2 space-y-2"
            >
              <FormField
                control={form.control}
                name="password"
                label="Current Password"
              >
                {field => (
                  <PasswordInput
                    {...field}
                    placeholder="Enter your current password"
                  />
                )}
              </FormField>
              <DialogFooter className="mt-4">
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
                  variant="destructive"
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete Account'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAccountDialog
