import { FilesIcon, SearchIcon, SettingsIcon, Share2Icon } from 'lucide-react'
import type { PanelKey, Tab, TabKey } from './types'

export const TAB_DEFINITIONS: Omit<Tab, 'panels'>[] = [
  {
    key: 'files',
    icon: FilesIcon,
    position: 'top',
  },
  {
    key: 'search',
    icon: SearchIcon,
    position: 'top',
  },
  {
    key: 'invite',
    icon: Share2Icon,
    position: 'top',
  },
  {
    key: 'settings',
    icon: SettingsIcon,
    position: 'bottom',
  },
]

export const PANEL_DEFINITIONS: Record<
  TabKey,
  { key: PanelKey; title: string }[]
> = {
  files: [
    { key: 'files', title: 'Files' },
    // { key: 'chats', title: 'Chats' },
  ],
  search: [{ key: 'search', title: 'Search' }],
  invite: [{ key: 'invite', title: 'Invite' }],
  settings: [{ key: 'settings', title: 'Settings' }],
}
