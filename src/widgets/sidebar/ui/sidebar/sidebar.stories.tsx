import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Sidebar from './sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Widgets/Sidebar/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

// Default Sidebar
export const Default: Story = {
  args: {
    panels: [
      {
        type: 'files',
        title: 'Files',
        content: <div>File Explorer Content</div>,
      },
    ],
  },
}

// Sidebar with Multiple Panels
export const WithMultiplePanels: Story = {
  args: {
    panels: [
      {
        type: 'files',
        title: 'Files',
        content: <div>File Explorer Content</div>,
      },
      {
        type: 'search',
        title: 'Search',
        content: <div>Search Panel Content</div>,
      },
      {
        type: 'members',
        title: 'Members',
        content: <div>Members Panel Content</div>,
      },
    ],
  },
}
