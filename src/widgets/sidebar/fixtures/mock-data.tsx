import { FilesIcon, SearchIcon, SettingsIcon, Share2Icon } from 'lucide-react'
import ChatPanel from '@/features/chat/ui/chat-panel/chat-panel'
import FileExplorerPanel from '@/features/file-explorer/ui/file-explorer-panel/file-explorer-panel'
import type { Tab } from '@/widgets/sidebar/model/types'

// 기본 mock 데이터
const mockItems = Array.from({ length: 40 }, (_, i) => `Item ${i + 1}`)

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
        content: <FileExplorerPanel />,
      },
      {
        type: 'chats',
        title: 'Chats',
        content: <ChatPanel />,
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
        content: mockItems.slice(25, 30), // 검색 결과 (5개)
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
        content: mockItems.slice(30, 35), // 초대 목록 (5개)
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
        content: mockItems.slice(35, 40), // 설정 옵션 (5개)
      },
    ],
  },
]
