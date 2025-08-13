import { Eye, EyeOff } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { useState } from 'react'
import { Input } from '@/shared/ui/shadcn/input'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const PasswordInput = ({ value, onChange, ...rest }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false)
  const Icon = visible ? Eye : EyeOff

  return (
    <div style={{ position: 'relative' }}>
      <Input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <button
        type="button"
        aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
        onClick={() => setVisible(v => !v)}
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'hsl(var(--muted-foreground))',
        }}
        tabIndex={-1}
      >
        <Icon className="h-3 w-3 text-muted-foreground" />
      </button>
    </div>
  )
}

export default PasswordInput
