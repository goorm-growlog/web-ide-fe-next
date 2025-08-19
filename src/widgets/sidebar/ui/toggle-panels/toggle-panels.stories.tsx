import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { mockPanels } from '@/widgets/sidebar/fixtures/mock-data'
import TogglePanels from './toggle-panels'

const meta: Meta<typeof TogglePanels> = {
  title: 'Widgets/Sidebar/TogglePanels',
  parameters: {
    layout: 'fullscreen',
  },
  component: TogglePanels,
  args: {
    panels: mockPanels,
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <div
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <TogglePanels {...args} />
    </div>
  ),
}
