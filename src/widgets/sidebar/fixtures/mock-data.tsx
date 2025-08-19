import { FilesIcon, SearchIcon, SettingsIcon, Share2Icon } from 'lucide-react'
import { mockMessages } from '@/features/chat/fixtures/mock-data'
import ChatPanel from '@/features/chat/ui/chat-panel/chat-panel'
import { mockFileTree } from '@/features/file-explorer/fixtures/mock-data'
import FileExplorerPanel from '@/features/file-explorer/ui/file-explorer-panel/file-explorer-panel'
import type { Panel, Tab } from '@/widgets/sidebar/model/types'

const mockItems = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`)

export const mockPanels: Panel[] = [
  {
    type: 'files',
    title: 'Files',
    content: <FileExplorerPanel rootItemId={'/'} fileTree={mockFileTree} />,
  },
  {
    type: 'chats',
    title: 'Chats',
    content: (
      <ChatPanel
        messages={mockMessages}
        currentUserId={1}
        onSendMessage={(message: string): void =>
          console.log(`Send Message: ${message}`)
        }
      />
    ),
  },
  {
    type: 'search',
    title: 'Search',
    content: <div>Search</div>,
  },
]

export const mockTabs: Tab[] = [
  {
    key: 'files',
    icon: FilesIcon,
    title: 'Files',
    position: 'top',
    panels: [
      {
        type: 'files',
        title: 'Files',
        content: <FileExplorerPanel rootItemId={'/'} fileTree={mockFileTree} />,
      },
      {
        type: 'chats',
        title: 'Chats',
        content: (
          <ChatPanel
            messages={mockMessages}
            currentUserId={1}
            onSendMessage={(message: string): void =>
              console.log(`Send Message: ${message}`)
            }
          />
        ),
      },
    ],
  },
  {
    key: 'search',
    icon: SearchIcon,
    title: 'Search',
    position: 'top',
    panels: [
      {
        type: 'search',
        title: 'Search',
        content: mockItems.slice(25, 30),
      },
    ],
  },
  {
    key: 'invite',
    icon: Share2Icon,
    title: 'Invite',
    position: 'top',
    panels: [
      {
        type: 'invite',
        title: 'Invite',
        content: mockItems.slice(30, 35),
      },
    ],
  },
  {
    key: 'settings',
    icon: SettingsIcon,
    title: 'Settings',
    position: 'bottom',
    panels: [
      {
        type: 'settings',
        title: 'Settings',
        content: mockItems.slice(35, 40),
      },
    ],
  },
]
