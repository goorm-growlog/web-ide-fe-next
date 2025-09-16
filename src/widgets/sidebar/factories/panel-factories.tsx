import type { ReactNode } from 'react'
import { ChatPanel } from '@/features/chat/ui/chat-panel'
import FileExplorerPanel from '@/features/file-explorer/ui/file-explorer-panel'
import InvitePanel from '@/features/invite/ui/invite-panel'
import type { PanelRenderProps } from '@/widgets/sidebar/model/types'

/**
 * 파일 탐색기 패널을 생성하는 팩토리 함수
 */
export const createFileExplorerPanel = ({
  fileTreeData,
  projectId,
  onFileOpen,
}: PanelRenderProps): ReactNode => {
  if (!fileTreeData || !projectId) {
    return null
  }

  return (
    <FileExplorerPanel
      fileTreeData={fileTreeData}
      projectId={projectId}
      onFileOpen={onFileOpen}
    />
  )
}

/**
 * 초대 패널을 생성하는 팩토리 함수
 */
export const createInvitePanel = (_props: PanelRenderProps): ReactNode => {
  return <InvitePanel />
}

/**
 * 채팅 패널을 생성하는 팩토리 함수
 */
export const createChatPanel = ({
  chatData,
  projectId,
}: PanelRenderProps): ReactNode => {
  if (!chatData || !projectId) {
    return null
  }

  return <ChatPanel chatData={chatData} />
}
