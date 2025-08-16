import type { Meta, StoryObj } from '@storybook/nextjs'
import Sidebar from './sidebar'

const meta = {
  title: 'Widgets/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
