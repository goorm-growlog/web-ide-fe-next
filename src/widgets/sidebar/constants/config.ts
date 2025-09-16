import { FilesIcon, Share2Icon } from 'lucide-react'
import type { SidebarConfig, Tab } from 'src/widgets/sidebar/model/types'
import {
  createFileExplorerPanel,
  createInvitePanel,
  createMembersPanel,
} from '@/widgets/sidebar/factories/panel-factories'

export const DEFAULT_SIDEBAR_CONFIG: SidebarConfig = {
  primaryMinSize: 2.5,
  secondaryMinSize: 2.5,
  maxSize: 45,
}

export const TAB_DEFINITIONS: Tab[] = [
  {
    key: 'files',
    panels: [
      {
        key: 'files',
        title: 'Files',
        render: createFileExplorerPanel,
      },
    ],
    icon: FilesIcon,
    position: 'top',
  },
  {
    key: 'invite' as const,
    panels: [
      {
        key: 'invite',
        title: 'Invite',
        render: createInvitePanel,
      },
      {
        key: 'members',
        title: 'Members',
        render: createMembersPanel,
      },
    ],
    icon: Share2Icon,
    position: 'top',
  },
] as const

// INITIAL_STATE는 store.ts에서 직접 정의 (순환 참조 방지)
