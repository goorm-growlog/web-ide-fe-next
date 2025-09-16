'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { MailIcon, UserPlusIcon, XIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
})

type EmailFormData = z.infer<typeof emailSchema>

interface InvitationFormProps {
  onSubmit: (data: { email: string; role: 'WRITE' | 'READ' }) => Promise<void>
}

export function InvitationForm({ onSubmit }: InvitationFormProps) {
  const [pendingEmails, setPendingEmails] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  // 이메일 추가
  const onAddEmail = useCallback(
    ({ email }: EmailFormData) => {
      if (!pendingEmails.includes(email)) {
        setPendingEmails(prev => [...prev, email])
        form.reset()
      }
    },
    [pendingEmails, form],
  )

  // 이메일 제거
  const handleRemoveEmail = useCallback((emailToRemove: string) => {
    setPendingEmails(prev => prev.filter(email => email !== emailToRemove))
  }, [])

  // 초대 전송 - 개별 이메일로 처리
  const handleSendInvitations = useCallback(async () => {
    if (pendingEmails.length === 0) return

    setIsLoading(true)
    try {
      // 개별 초대
      for (const email of pendingEmails) {
        await onSubmit({ email, role: 'WRITE' })
      }
      setPendingEmails([])
    } catch (error) {
      console.error('Failed to send invitations:', error)
    } finally {
      setIsLoading(false)
    }
  }, [pendingEmails, onSubmit])

  const isInviteDisabled = pendingEmails.length === 0 || isLoading

  // 내부 컴포넌트: 이메일 목록 (원본 스타일)
  const EmailList = () => (
    <>
      {pendingEmails.length === 0 ? (
        <div className="text-center text-[var(--color-muted-foreground)] text-sm normal-case">
          Add emails to invite
        </div>
      ) : (
        <div className="flex min-h-[40px] flex-wrap items-center gap-2">
          {pendingEmails.map(emailItem => (
            <Badge
              className="flex items-center gap-1 bg-[var(--color-secondary)] px-2 py-1 text-[var(--color-secondary-foreground)]"
              key={emailItem}
              variant="secondary"
            >
              <span className="text-xs">{emailItem}</span>
              <Button
                aria-label={`Remove ${emailItem}`}
                className="ml-1 h-4 w-4 p-0 text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)]"
                disabled={isLoading}
                onClick={() => handleRemoveEmail(emailItem)}
                type="button"
                variant="ghost"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </>
  )

  // 내부 컴포넌트: 초대 버튼 (원본 스타일)
  const InviteButton = () => (
    <Button
      aria-label="Send invitations"
      className="w-full"
      disabled={isInviteDisabled}
      onClick={handleSendInvitations}
      size="default"
      type="button"
      variant="default"
    >
      <MailIcon className="h-5 w-5" />
      {isLoading
        ? 'Sending...'
        : `Invite Team Member ${pendingEmails.length > 0 ? `(${pendingEmails.length})` : ''}`}
    </Button>
  )

  return (
    <>
      <Form {...form}>
        <form
          className="flex items-center gap-2 border-[var(--color-border)] bg-[var(--color-background)]"
          noValidate
          onSubmit={form.handleSubmit(onAddEmail)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Invite by member email"
                      type="email"
                    />
                  </FormControl>
                  <Button
                    aria-label="Add email to invite list"
                    className="rounded-md"
                    disabled={isLoading}
                    size="icon"
                    type="submit"
                  >
                    <UserPlusIcon className="h-5 w-5" />
                  </Button>
                </div>
                <FormMessage className="min-h-[20px] text-xs transition-opacity duration-200">
                  {form.formState.errors.email?.message || '\u00A0'}
                </FormMessage>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <EmailList />
      <div className="min-h-[20px]">{'\u00A0'}</div>
      <InviteButton />
    </>
  )
}
