import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import PrimarySidebar from './primary-sidebar'

const meta: Meta<typeof PrimarySidebar> = {
  title: 'Widgets/Sidebar/PrimarySidebar',
  component: PrimarySidebar,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PrimarySidebar>

// Primary Sidebar (Left)
export const Left: Story = {
  args: {
    position: 'left',
  },
}

// Primary Sidebar (Right)
export const Right: Story = {
  args: {
    position: 'right',
  },
}
