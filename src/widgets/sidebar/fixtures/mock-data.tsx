import { FilesIcon, SearchIcon, SettingsIcon, Share2Icon } from 'lucide-react'
import ChatPanel from '@/features/chat/ui/chat-panel/chat-panel'
import FileExplorerPanel from '@/features/file-explorer/ui/file-explorer-panel/file-explorer-panel'
import type { Panel, Tab } from '@/widgets/sidebar/model/types'

const mockItems = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`)

export const mockPanels: Panel[] = [
  {
    key: 'files',
    title: 'Files',
    content: <FileExplorerPanel />,
  },
  {
    key: 'search',
    title: 'Search',
    content: <FileExplorerPanel />,
  },
]

export const mockTabs: Tab[] = [
  {
    key: 'files',
    icon: FilesIcon,
    position: 'top',
    panels: [
      {
        key: 'files',
        title: 'Files',
        content: <FileExplorerPanel />,
      },
      {
        key: 'chats',
        title: 'Chats',
        content: <ChatPanel />,
      },
    ],
  },
  {
    key: 'search',
    icon: SearchIcon,
    position: 'top',
    panels: [
      {
        key: 'search',
        title: 'Search',
        content: mockItems.slice(25, 30),
      },
    ],
  },
  {
    key: 'invite',
    icon: Share2Icon,
    position: 'top',
    panels: [
      {
        key: 'invite',
        title: 'Invite',
        content: mockItems.slice(30, 35),
      },
    ],
  },
  {
    key: 'settings',
    icon: SettingsIcon,
    position: 'bottom',
    panels: [
      {
        key: 'settings',
        title: 'Settings',
        content: mockItems.slice(35, 40),
      },
    ],
  },
]
