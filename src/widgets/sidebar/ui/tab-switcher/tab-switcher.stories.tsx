import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fn } from 'storybook/test'
import { mockTabs } from '@/widgets/sidebar/fixtures/mock-data'
import TabSwitcher from './tab-switcher'

const meta = {
  title: 'Widgets/Sidebar/TabSwitcher',
  component: TabSwitcher,
  parameters: {
    layout: 'centered',
  },
  args: {
    tabs: mockTabs,
    activeTabKey: 'files',
    onTabClick: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="h-[50vh]">
      <TabSwitcher tabs={mockTabs} activeTabKey="files" onTabClick={fn()} />
    </div>
  ),
}
