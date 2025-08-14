import type { ComponentProps, ReactNode } from 'react'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'

export interface InputWithButtonProps {
  inputProps?: ComponentProps<typeof Input>
  buttonProps?: ComponentProps<typeof Button>
  buttonText?: ReactNode
  className?: string
}

export default function InputWithButton({
  inputProps,
  buttonProps,
  buttonText,
  className,
}: InputWithButtonProps) {
  return (
    <div className={`flex gap-2 ${className || ''}`}>
      <Input className="flex-1" {...inputProps} />
      <Button type="button" {...buttonProps}>
        {buttonText}
      </Button>
    </div>
  )
}
