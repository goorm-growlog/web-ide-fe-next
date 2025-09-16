import type { ReactNode } from 'react'
import { ChatPanel } from '@/features/chat/ui/chat-panel'
import FileExplorerPanel from '@/features/file-explorer/ui/file-explorer-panel'
import type { Member, ProjectRole } from '@/features/invite/types/invite-types'
import { InvitationForm } from '@/features/invite/ui/invitation-form'
import { MemberList } from '@/features/invite/ui/member-list'
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
 * 초대 폼 패널을 생성하는 팩토리 함수
 */
export const createInviteFormPanel = (_props: PanelRenderProps): ReactNode => {
  // TODO: 실제 초대 로직 구현 필요
  const handleInvite = async (data: {
    email: string
    role: 'WRITE' | 'READ'
  }) => {
    console.log('Invite user:', data)
  }

  return (
    <div className="p-4">
      <InvitationForm onSubmit={handleInvite} />
    </div>
  )
}

/**
 * 초대 패널을 생성하는 팩토리 함수 (InvitationForm만 포함)
 */
export const createInvitePanel = (_props: PanelRenderProps): ReactNode => {
  // TODO: 실제 초대 로직 구현 필요
  const handleInvite = async (data: {
    email: string
    role: 'WRITE' | 'READ'
  }) => {
    console.log('Invite user:', data)
  }

  return (
    <div className="p-4">
      <InvitationForm onSubmit={handleInvite} />
    </div>
  )
}

/**
 * 멤버 목록 패널을 생성하는 팩토리 함수
 */
export const createMembersPanel = (_props: PanelRenderProps): ReactNode => {
  // TODO: 실제 멤버 데이터 및 로직 구현 필요
  const mockMembers: Member[] = [
    {
      userId: 1,
      name: 'John Doe',
      email: 'user@example.com',
      profileImageUrl: '',
      role: 'OWNER' as ProjectRole,
    },
  ]

  return (
    <div className="p-4">
      <MemberList
        members={mockMembers}
        isLoading={false}
        canManage={true}
        currentUserId={1}
      />
    </div>
  )
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
