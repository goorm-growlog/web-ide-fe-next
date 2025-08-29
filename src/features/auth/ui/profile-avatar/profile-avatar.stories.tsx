import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import ProfileAvatar from './index'

const meta: Meta<typeof ProfileAvatar> = {
  title: 'Features/Auth/ProfileAvatar',
  component: ProfileAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'ProfileAvatar component for selecting and previewing a profile image. 파일 선택 및 미리보기 기능을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [image, setImage] = useState<string | undefined>()
    return (
      <ProfileAvatar
        src={image ?? undefined}
        onImageSelect={(file: File) => {
          const reader = new FileReader()
          reader.onload = e => setImage(e.target?.result as string)
          reader.readAsDataURL(file)
        }}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic usage of ProfileAvatar. 프로필 이미지를 선택하고 미리볼 수 있습니다.',
      },
    },
  },
}
