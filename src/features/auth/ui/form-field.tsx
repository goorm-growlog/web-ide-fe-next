import type { ReactNode } from 'react'
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField as ShadcnFormField,
} from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'

interface FormFieldProps<
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>,
> extends Omit<ControllerProps<T, N>, 'render'> {
  label: string
  placeholder?: string
  type?: string
  children?: ReactNode
  className?: string
}

const FormField = <
  T extends FieldValues = FieldValues,
  N extends FieldPath<T> = FieldPath<T>,
>({
  label,
  placeholder,
  type = 'text',
  children,
  className,
  ...props
}: FormFieldProps<T, N>) => (
  <ShadcnFormField
    {...props}
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
