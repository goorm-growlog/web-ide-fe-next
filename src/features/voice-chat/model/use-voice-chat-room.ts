import { useLiveKit } from '@/entities/voice-chat/lib/use-livekit'

interface UseVoiceChatRoomProps {
  roomName: string
  userName: string
  userId: string
  onError?: (error: string) => void
}

export function useVoiceChatRoom({
  roomName,
  userName,
  userId,
  onError,
}: UseVoiceChatRoomProps) {
  const {
    isConnected,
    isConnecting,
    error,
    participants,
    localParticipant,
    speakingParticipants,
    connect,
    disconnect,
    toggleMicrophone,
  } = useLiveKit({
    roomName,
    userName,
    userId,
    ...(onError && { onError }),
  })

  return {
    // 상태
    isConnected,
    isConnecting,
    error,
    participants,
    localParticipant,
    speakingParticipants,

    // 액션
    connect,
    disconnect,
    toggleMicrophone,
  }
}
