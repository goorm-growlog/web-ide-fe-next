import type { ReactNode } from 'react'
import ChatPanel from '@/features/chat/ui/chat-panel/chat-panel'
import FileExplorerPanel from '@/features/file-explorer/ui/file-explorer-panel/file-explorer-panel'
import Invite from '@/features/invite/ui/invite'
import Search from '@/features/search/ui/search'
import type { PanelKey } from '../model/types'

// Sidebar panel components mapping
export const SIDEBAR_PANEL_COMPONENTS: Record<PanelKey, () => ReactNode> = {
  files: () => <FileExplorerPanel />,
  chats: () => <ChatPanel />,
  search: () => <Search />,
  invite: () => <Invite />,
  settings: () => (
    <div className="p-4 text-muted-foreground text-sm">Settings</div>
  ),
}
