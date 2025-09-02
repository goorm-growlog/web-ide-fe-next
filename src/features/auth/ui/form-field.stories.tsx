import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  emailSchema,
  nameSchema,
  signupPasswordSchema,
} from '../model/validation-schema'
import FormField from './form-field'
import PasswordInput from './password-input'

// 스토리북용 간단한 폼 스키마
const storyFormSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: signupPasswordSchema,
})

type StoryFormData = z.infer<typeof storyFormSchema>

// 메타 구성 (Storybook용)
const meta: Meta<typeof FormField> = {
  title: 'Features/Auth/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FormField component integrating React Hook Form and shadcn/ui Form. Includes auto validation and error handling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Field name',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    placeholder: {
      control: 'text',
      description: 'Input field hint',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: 'Input field type',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 기본 예시
export const Default: Story = {
  render: () => {
    const methods = useForm<StoryFormData>({
      resolver: zodResolver(storyFormSchema),
      defaultValues: {
        email: '',
      },
    })

    return (
      <FormProvider {...methods}>
        <FormField
          name="email"
          control={methods.control}
          label="Email"
          placeholder="your@email.com"
          type="email"
        />
      </FormProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic email input field.',
      },
    },
  },
}

// 비밀번호 입력 예시
export const WithPasswordInput: Story = {
  render: () => {
    const methods = useForm<StoryFormData>({
      resolver: zodResolver(storyFormSchema),
      defaultValues: {
        password: '',
      },
    })

    return (
      <FormProvider {...methods}>
        <FormField name="password" control={methods.control} label="Password">
          <PasswordInput
            placeholder="Enter your password"
            {...methods.register('password')}
          />
        </FormField>
      </FormProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Example using PasswordInput as children.',
      },
    },
  },
}

// 실시간 검증 데모
export const LiveValidationForm: Story = {
  render: () => {
    const methods = useForm<StoryFormData>({
      resolver: zodResolver(storyFormSchema),
      mode: 'onChange',
      defaultValues: {
        email: '',
        name: '',
        password: '',
      },
    })

    const onSubmit = (data: StoryFormData) => {
      // 검증 성공 시 데이터 알림
      alert(`Validation success! Data: ${JSON.stringify(data, null, 2)}`)
    }

    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-80 space-y-4"
        >
          <FormField
            name="email"
            control={methods.control}
            label="Email"
            placeholder="Enter a valid email"
            type="email"
          />
          <FormField
            name="name"
            control={methods.control}
            label="Name"
            placeholder="Enter your name"
            type="text"
          />
          <FormField name="password" control={methods.control} label="Password">
            <PasswordInput
              placeholder="Enter your password"
              {...methods.register('password')}
            />
          </FormField>
          <button
            type="submit"
            className="w-full rounded bg-zinc-800 p-2 text-white hover:bg-zinc-700"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Live validation demo. You can check validation errors while typing.',
      },
    },
  },
}
