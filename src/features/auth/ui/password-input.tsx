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
            'absolute right-2.5 top-1/2 -translate-y-1/2',
            'bg-transparent border-none cursor-pointer p-0 flex items-center',
            'text-muted-foreground hover:text-foreground',
            'transition-colors duration-200',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
