import type { Meta, StoryObj } from '@storybook/nextjs'
import { TogglePanels } from './toggle-panels'

const meta: Meta<typeof TogglePanels> = {
  title: 'Widgets/Sidebar/TogglePanels',
  component: TogglePanels,
}
export default meta

type Story = StoryObj<typeof TogglePanels>

export const Default: Story = {
  render: () => {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
        }}
      >
        <TogglePanels />
      </div>
    )
  },
}
