// 순수한 음성채팅 기능만
import { useLiveKit } from '@/entities/voice-chat/lib/use-livekit'

interface UseVoiceChatProps {
  roomName: string
  userName: string
  userId: string
  onError?: (error: string) => void
}

export function useVoiceChat({
  roomName,
  userName,
  userId,
  onError,
}: UseVoiceChatProps) {
  const voiceChat = useLiveKit({
    roomName,
    userName,
    userId,
    ...(onError && { onError }),
  })

  return {
    // 상태
    isConnected: voiceChat.isConnected,
    isConnecting: voiceChat.isConnecting,
    error: voiceChat.error,
    participants: voiceChat.participants, // ✅ 이미 mappedParticipants가 반환됨
    localParticipant: voiceChat.localParticipant,
    isMicrophoneEnabled:
      voiceChat.localParticipant?.isMicrophoneEnabled ?? false,
    isSpeaking: voiceChat.speakingParticipants.has(`user_${userId}`),
    isTogglingMicrophone: voiceChat.isTogglingMicrophone,

    // 액션
    connect: voiceChat.connect,
    disconnect: voiceChat.disconnect,
    toggleMicrophone: voiceChat.toggleMicrophone,
  }
}
