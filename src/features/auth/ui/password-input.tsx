'use client'

import { Eye, EyeOff } from 'lucide-react'
import type { ComponentProps } from 'react'
import { forwardRef, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/shadcn/input'

type InputProps = ComponentProps<'input'>

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const Icon = visible ? Eye : EyeOff

    return (
      <div className="relative">
        <Input
          {...props}
          type={visible ? 'text' : 'password'}
          className={cn(className, 'pr-10')}
          ref={ref}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          disabled={props.disabled}
          onClick={() => setVisible(v => !v)}
          className={cn(
            '-translate-y-1/2 absolute top-1/2 right-2.5',
            'flex cursor-pointer items-center border-none bg-transparent p-0',
            'text-muted-foreground hover:text-foreground',
            'transition-colors duration-200',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
