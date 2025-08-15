import type { Meta, StoryObj } from '@storybook/nextjs'

import { FilesIcon, SearchIcon, SettingsIcon, Share2Icon } from 'lucide-react'
import Invite from '@/features/invite/ui/invite'
import Search from '@/features/search/ui/search'
import type { Tab } from '../../model/types'
import Sidebar from './sidebar'

const meta = {
  title: 'Widgets/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>

export default meta

type Story = StoryObj<typeof meta>

const dummyList = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`)

const tabs: Tab[] = [
  {
    key: 'files',
    icon: FilesIcon,
    title: 'Files',
    position: 'top',
    panels: [
      {
        type: 'files',
        title: 'Files',
        content: (
          <div>
            {dummyList.map(item => (
              <div key={item}>{item}</div>
            ))}
          </div>
        ),
      },
      {
        type: 'chats',
        title: 'Chats',
        content: (
          <div>
            {dummyList.map(item => (
              <div key={item}>{item}</div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    key: 'search',
    icon: SearchIcon,
    title: 'Search',
    position: 'top',
    panels: [{ type: 'search', title: 'Search', content: <Search /> }],
  },
  {
    key: 'invite',
    icon: Share2Icon,
    title: 'Invite',
    position: 'top',
    panels: [{ type: 'invite', title: 'Invite', content: <Invite /> }],
  },
  {
    key: 'settings',
    icon: SettingsIcon,
    title: 'Settings',
    position: 'bottom',
    panels: [],
  },
]

export const Default: Story = {
  args: {
    tabs,
  },
}
