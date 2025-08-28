import type { Meta } from '@storybook/nextjs-vite'
import TogglePanels from '@/widgets/sidebar/ui/toggle-panels'

const meta: Meta<typeof TogglePanels> = {
  title: 'Widgets/Sidebar/TogglePanels',
  parameters: {
    layout: 'fullscreen',
  },
  component: TogglePanels,
  tags: ['autodocs'],
}
export default meta

export const Default = {
  render: () => (
    <div className="flex h-screen">
      <TogglePanels activeTabKey="files" />
    </div>
  ),
}
