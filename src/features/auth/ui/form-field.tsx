import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  children?: ReactNode
  containerClassName?: string
}

const FormField = ({
  id,
  label,
  children,
  className,
  containerClassName,
  ...props
}: FormFieldProps) => {
  return (
    <div
      className={cn(
        'grid w-full max-w-sm items-center gap-1.5',
        containerClassName,
      )}
    >
      <Label htmlFor={id}>{label}</Label>
      {children ?? <Input id={id} className={className} {...props} />}
    </div>
  )
}

export default FormField
