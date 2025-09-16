'use client'

import { ChevronDown, LogOut, MessageCircle, UserRoundPen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/auth-provider'
import type { ProjectMember } from '@/entities/project/model/types'
import type { Participant } from '@/entities/voice-chat/model/types'
import { useLogout } from '@/features/auth/logout/use-logout'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import { Button } from '@/shared/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import { VoiceChatStatus } from './voice-chat-status'

interface ProjectHeaderProps {
  projectId: string
  voiceChatStatus: {
    isConnected: boolean
    isConnecting: boolean
    hasError: boolean
    isDisconnected: boolean
    isMicrophoneEnabled: boolean
    isSpeaking: boolean
    isTogglingMicrophone: boolean
  }
  participants: Participant[]
  projectMembers: ProjectMember[]
  currentUser?:
    | {
        name: string
        userId: string
        profileImageUrl?: string
      }
    | undefined
  onReconnect?: () => void
  onToggleMicrophone?: () => void
  onSetParticipantVolume?: (participantIdentity: string, volume: number) => void
  onSetCurrentUserVolume?: (volume: number) => void
  onToggleChat?: () => void
  onExitProject?: () => void
}

export function ProjectHeader({
  voiceChatStatus,
  participants,
  projectMembers,
  currentUser,
  onReconnect,
  onToggleMicrophone,
  onSetParticipantVolume,
  onToggleChat,
  onExitProject,
}: ProjectHeaderProps) {
  const { logout } = useLogout()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const getInitial = (name?: string) => {
    if (!name) return 'U'
    return name.charAt(0).toUpperCase()
  }

  const handleExitProject = () => {
    if (onExitProject) {
      onExitProject()
    } else {
      router.push('/project')
    }
  }

  return (
    <header className="fixed top-0 z-50 flex h-[40px] w-full items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-6">
        <Image src="/logo.svg" alt="GrowLog" width={80} height={20} />
      </div>

      <div className="flex items-center gap-1">
        {/* 음성채팅 상태 */}
        <VoiceChatStatus
          {...voiceChatStatus}
          participants={participants}
          projectMembers={projectMembers}
          currentUser={currentUser}
          onReconnect={onReconnect}
          onToggleMicrophone={onToggleMicrophone}
          onVolumeChange={onSetParticipantVolume}
        />

        {/* 채팅 아이콘 */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onToggleChat}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>

        {/* 나가기 아이콘 */}
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 h-6 w-6"
          onClick={handleExitProject}
        >
          <LogOut className="h-4 w-4" />
        </Button>

        {/* 사용자 메뉴 */}
        {!isLoading && user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex select-none items-center gap-2">
              <Avatar className="h-8 w-8 select-none">
                <AvatarImage
                  src={user.profileImage || ''}
                  alt={user.name || 'Profile'}
                />
                <AvatarFallback className="text-sm">
                  {getInitial(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <UserRoundPen className="h-4 w-4" />
                  edit profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
