import type { ReactNode } from 'react'
import type {
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField as ShadcnFormField,
} from '@/shared/ui/shadcn/form'
import { Input } from '@/shared/ui/shadcn/input'

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number'
  children?:
    | ReactNode
    | ((field: ControllerRenderProps<TFieldValues, TName>) => ReactNode)
  className?: string
}

/**
 * React Hook Form과 shadcn/ui Form을 연동한 FormField 컴포넌트
 * ⚠️ 반드시 FormProvider로 감싸서 사용해야 합니다
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  placeholder,
  type = 'text',
  children,
  className,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <ShadcnFormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {typeof children === 'function'
              ? children(field)
              : (children ?? (
                  <Input
                    {...field}
                    type={type}
                    placeholder={placeholder}
                    className={className}
                  />
                ))}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormField
