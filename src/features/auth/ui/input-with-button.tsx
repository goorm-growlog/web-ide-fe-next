import type { ComponentProps, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'

export interface InputWithButtonProps extends ComponentProps<'input'> {
  inputProps?: ComponentProps<typeof Input>
  buttonProps?: ComponentProps<typeof Button>
  buttonText?: ReactNode
  buttonWidth?: string
  className?: string
}

const InputWithButton = forwardRef<HTMLInputElement, InputWithButtonProps>(
  (props, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      inputProps,
      buttonProps,
      buttonText,
      buttonWidth = '4.5rem',
      className,
      ...rest
    } = props

    return (
      <div className={cn('flex gap-2', className)}>
        <Input
          ref={ref}
          {...inputProps}
          {...rest}
          className={cn('flex-1', inputProps?.className, className)}
        />
        <Button
          type="button"
          {...buttonProps}
          style={{ ...buttonProps?.style, width: buttonWidth }}
        >
          {buttonText}
        </Button>
      </div>
    )
  },
)
InputWithButton.displayName = 'InputWithButton'

export default InputWithButton
