export interface VoiceChatState {
  isConnected: boolean
  isConnecting: boolean
  hasError: boolean
  isDisconnected: boolean
  isMicrophoneEnabled: boolean
  isSpeaking: boolean
  error?: string
}

export interface Participant {
  identity: string
  name: string
  isMicrophoneEnabled: boolean
  isSpeaking: boolean
  volume: number
}
