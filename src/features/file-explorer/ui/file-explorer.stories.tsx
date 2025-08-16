import type { Meta, StoryObj } from '@storybook/react'
import FileExplorer from './file-explorer'

const meta: Meta<typeof FileExplorer> = {
  title: 'Features/FileExplorer',
  component: FileExplorer,
}
export default meta

type Story = StoryObj<typeof FileExplorer>

export const Default: Story = {}
