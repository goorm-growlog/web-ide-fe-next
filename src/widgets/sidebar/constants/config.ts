import { FilesIcon, Share2Icon } from 'lucide-react'
import type {
  SidebarConfig,
  SidebarState,
  Tab,
} from 'src/widgets/sidebar/model/types'
import {
  createFileExplorerPanel,
  createInvitePanel,
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
    ],
    icon: Share2Icon,
    position: 'top',
  },
] as const

export const INITIAL_STATE: SidebarState = {
  activeTab: 'files',
  openPanelsByTab: {
    files: ['files'],
    search: [],
    invite: [],
    settings: [],
  },
  position: 'left',
  primarySize: 25,
  secondarySize: 25,
}
