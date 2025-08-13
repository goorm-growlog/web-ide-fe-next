import type { ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'

interface FormFieldProps<T extends FieldValues = FieldValues> {
  name: Path<T> // 필드 이름 (react-hook-form에서 사용)
  control: Control<T> // react-hook-form의 control 객체
  label: string
  placeholder?: string
  type?: string // input 타입 (text, email, password 등)
  children?: ReactNode // 커스텀 input을 넣고 싶을 때
  className?: string
}

const FormField = <T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  children,
  className,
}: FormFieldProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          {children ?? (
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className={className}
            />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

export default FormField
