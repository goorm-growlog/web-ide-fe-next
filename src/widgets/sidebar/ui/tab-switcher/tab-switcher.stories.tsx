import type { Meta, StoryObj } from '@storybook/nextjs'
import { FilesIcon, SearchIcon, SettingsIcon, Share2Icon } from 'lucide-react'
import { fn } from 'storybook/test'
import TabSwitcher from './tab-switcher'

const meta = {
  title: 'Widgets/Sidebar/TabSwitcher',
  component: TabSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tabs: { control: false },
    activeTabKey: { control: 'text' },
    onTabClick: { action: 'tabClick' },
  },
  args: {
    tabs: [
      {
        key: 'files',
        icon: FilesIcon,
        title: 'Files',
        position: 'top',
        panels: [],
      },
      {
        key: 'search',
        icon: SearchIcon,
        title: 'Search',
        position: 'top',
        panels: [],
      },
      {
        key: 'invite',
        icon: Share2Icon,
        title: 'Invite',
        position: 'top',
        panels: [],
      },
      {
        key: 'settings',
        icon: SettingsIcon,
        title: 'Settings',
        position: 'bottom',
        panels: [],
      },
    ],
    activeTabKey: 'files',
    onTabClick: fn(),
  },
} satisfies Meta<typeof TabSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <div
      style={{
        height: '50vh',
        display: 'flex',
      }}
    >
      <TabSwitcher {...args} />
    </div>
  ),
}
