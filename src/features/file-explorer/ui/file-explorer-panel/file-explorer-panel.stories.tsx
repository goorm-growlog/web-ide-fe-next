import type { Meta, StoryObj } from '@storybook/nextjs'
import FileExplorerPanel from './file-explorer-panel'

const meta: Meta<typeof FileExplorerPanel> = {
  title: 'Features/FileExplorerPanel',
  component: FileExplorerPanel,
}
export default meta

type Story = StoryObj<typeof FileExplorerPanel>

export const Default: Story = {}
