import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { mockFileTree } from '@/features/file-explorer/fixtures/mock-data'
import FileExplorerPanel from './file-explorer-panel'

const meta: Meta<typeof FileExplorerPanel> = {
  title: 'Features/FileExplorerPanel',
  component: FileExplorerPanel,
  parameters: {
    layout: 'centered',
  },
  args: {
    rootItemId: '/',
    fileTree: mockFileTree,
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
