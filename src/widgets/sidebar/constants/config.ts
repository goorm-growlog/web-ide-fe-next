import { FilesIcon, SearchIcon, SettingsIcon, Share2Icon } from 'lucide-react'
import type {
  SidebarConfig,
  SidebarState,
  Tab,
} from 'src/widgets/sidebar/model/types'
import FileExplorerPanel from '@/features/file-explorer/ui/file-explorer-panel'
import InvitePanel from '@/features/invite/ui/invite-panel'
import SearchPanel from '@/features/search/ui/search-panel'
import SettingsPanel from '@/features/setting/ui/setting-panel'

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
        content: FileExplorerPanel,
      },
    ],
    icon: FilesIcon,
    position: 'top',
  },
  {
    key: 'search',
    panels: [
      {
        key: 'search',
        title: 'Search',
        content: SearchPanel,
      },
    ],
    icon: SearchIcon,
    position: 'top',
  },
  {
    key: 'invite' as const,
    panels: [
      {
        key: 'invite',
        title: 'Invite',
        content: InvitePanel,
      },
    ],
    icon: Share2Icon,
    position: 'top',
  },
  {
    key: 'settings',
    panels: [
      {
        key: 'settings',
        title: 'Settings',
        content: SettingsPanel,
      },
    ],
    icon: SettingsIcon,
    position: 'bottom',
  },
] as const

const DEFAULT_LAYOUT = [25, 50, 25]

export const INITIAL_STATE: SidebarState = {
  activeTab: 'files',
  openPanelsByTab: {
    files: [],
    search: [],
    invite: [],
    settings: [],
  },
  position: 'left',
  layout: DEFAULT_LAYOUT,
  layoutIndices: { primary: 0, secondary: 2, main: 1 },
}
