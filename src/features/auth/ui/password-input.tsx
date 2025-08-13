import { Eye, EyeOff } from 'lucide-react'
import type { ComponentProps } from 'react'
import { forwardRef, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/shadcn/input'
import styles from './password-input.module.css'

type InputProps = ComponentProps<'input'>

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const Icon = visible ? Eye : EyeOff

    return (
      <div className={styles.root}>
        <Input
          type={visible ? 'text' : 'password'}
          className={cn(className, 'pr-10')}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
          onClick={() => setVisible(v => !v)}
          className={styles.toggle}
          tabIndex={-1}
        >
          <Icon className={styles.icon} />
        </button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
