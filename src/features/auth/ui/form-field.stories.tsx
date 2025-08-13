import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { FormProvider, useForm } from 'react-hook-form'
import { type FormData, formSchema } from '../model/validation-schema'
import FormField from './form-field'
import PasswordInput from './password-input'

// Meta configuration
const meta: Meta<typeof FormField> = {
  title: 'Features/Auth/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'React Hook Form과 shadcn/ui Form을 통합한 FormField 컴포넌트입니다. 자동 검증과 오류 처리가 포함되어 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: '필드 이름',
    },
    label: {
      control: 'text',
      description: '레이블 텍스트',
    },
    placeholder: {
      control: 'text',
      description: '입력 필드 힌트',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: '입력 필드 타입',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: () => {
    const methods = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: '',
      },
    })

    return (
      <FormProvider {...methods}>
        <FormField
          name="email"
          control={methods.control}
          label="이메일"
          placeholder="your@email.com"
          type="email"
        />
      </FormProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: '기본 이메일 입력 필드입니다.',
      },
    },
  },
}

// Password input example
export const WithPasswordInput: Story = {
  render: () => {
    const methods = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        password: '',
      },
    })

    return (
      <FormProvider {...methods}>
        <FormField name="password" control={methods.control} label="비밀번호">
          <PasswordInput
            placeholder="비밀번호를 입력하세요"
            {...methods.register('password')}
          />
        </FormField>
      </FormProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'PasswordInput 컴포넌트를 children으로 사용하는 예시입니다.',
      },
    },
  },
}

// Validation demo
export const ValidationDemo: Story = {
  render: () => {
    const methods = useForm<FormData>({
      resolver: zodResolver(formSchema),
      mode: 'onChange',
      defaultValues: {
        email: '',
        name: '',
        password: '',
      },
    })

    const onSubmit = (data: FormData) => {
      alert(`검증 성공! 데이터: ${JSON.stringify(data, null, 2)}`)
    }

    return (
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-4 w-80"
        >
          <FormField
            name="email"
            control={methods.control}
            label="이메일 (실시간 검증)"
            placeholder="올바른 이메일을 입력하세요"
            type="email"
          />
          <FormField
            name="name"
            control={methods.control}
            label="이름 (2글자 이상)"
            placeholder="이름을 입력하세요"
            type="text"
          />
          <FormField
            name="password"
            control={methods.control}
            label="비밀번호 (8글자 이상)"
          >
            <PasswordInput
              placeholder="비밀번호를 입력하세요"
              {...methods.register('password')}
            />
          </FormField>
          <button
            type="submit"
            className="w-full bg-zinc-800 text-white p-2 rounded hover:bg-zinc-700"
          >
            제출
          </button>
        </form>
      </FormProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          '실시간 검증 데모입니다. 입력하면서 검증 오류를 확인할 수 있습니다.',
      },
    },
  },
}
