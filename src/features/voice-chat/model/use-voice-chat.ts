// 순수한 음성채팅 기능만

import type { Room } from 'livekit-client'
import { useLiveKit } from '@/entities/voice-chat/lib/use-livekit'
import type { Participant } from '@/entities/voice-chat/model/types'

interface UseVoiceChatProps {
  roomName: string
  userName: string
  userId: string
  onError?: (error: string) => void
}

// 새로운 확장된 인터페이스
interface UseVoiceChatReturn {
  isConnected: boolean
  isConnecting: boolean
  hasError: boolean
  isDisconnected: boolean
  isMicrophoneEnabled: boolean
  isSpeaking: boolean
  isTogglingMicrophone: boolean
  error: string | undefined
  participants: Participant[]
  room: Room | null

  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  toggleMicrophone: () => Promise<void>
  setParticipantVolume: (participantIdentity: string, volume: number) => void
}

export function useVoiceChat({
  roomName,
  userName,
  userId,
}: UseVoiceChatProps): UseVoiceChatReturn {
  const voiceChat = useLiveKit({
    roomName,
    userName,
    userId,
  })

  return {
    isConnected: voiceChat.isConnected,
    isConnecting: voiceChat.isConnecting,
    hasError: !!voiceChat.error,
    isDisconnected: !voiceChat.isConnected && !voiceChat.isConnecting,
    isMicrophoneEnabled: voiceChat.isMicrophoneEnabled,
    isSpeaking: voiceChat.isSpeaking,
    isTogglingMicrophone: voiceChat.isTogglingMicrophone,
    error: voiceChat.error ?? undefined,
    participants: voiceChat.participants,
    room: voiceChat.room,

    // Actions
    connect: voiceChat.connect,
    disconnect: voiceChat.disconnect,
    toggleMicrophone: voiceChat.toggleMicrophone,
    setParticipantVolume: voiceChat.setParticipantVolume,
  }
}
