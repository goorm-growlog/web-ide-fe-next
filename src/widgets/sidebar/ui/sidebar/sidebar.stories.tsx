import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import TogglePanels from '../toggle-panels/toggle-panels'
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

export const Default: Story = {
  args: {
    children: (
      <TogglePanels
        panels={[
          {
            key: 'files',
            title: 'Files',
            content: <div>File Explorer Content</div>,
          },
        ]}
      />
    ),
  },
}

export const WithMultiplePanels: Story = {
  args: {
    children: (
      <TogglePanels
        panels={[
          {
            key: 'files',
            title: 'Files',
            content: <div>File Explorer Content</div>,
          },
          {
            key: 'search',
            title: 'Search',
            content: <div>Search Panel Content</div>,
          },
          {
            key: 'invite',
            title: 'Invite',
            content: <div>Invite Panel Content</div>,
          },
        ]}
      />
    ),
  },
}
