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

export const CustomIndent: Story = {
  args: {
    rootItemId: '/',
    fileTree: mockFileTree,
    indent: 24, // 더 큰 들여쓰기
  },
}

export const CustomRoot: Story = {
  args: {
    rootItemId: '/src',
    fileTree: mockFileTree,
    indent: 16,
  },
}
