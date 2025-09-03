import type { Meta, StoryObj } from '@storybook/react'
import CreateProjectCard from './create-project-card'

const meta: Meta<typeof CreateProjectCard> = {
  title: 'Features/Project/CreateProjectCard',
  component: CreateProjectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Interactive: Story = {
  args: {
    onClick: () => {
      console.log('Create project card clicked')
    },
  },
}
