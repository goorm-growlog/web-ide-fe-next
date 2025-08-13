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
          type={visible ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          <Icon className="h-3 w-3" />
        </button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
