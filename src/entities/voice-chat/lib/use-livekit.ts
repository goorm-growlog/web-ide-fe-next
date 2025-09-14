import {
  ConnectionState,
  DisconnectReason,
  type LocalParticipant,
  type RemoteAudioTrack,
  RemoteParticipant,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client'
import { useEffect, useRef, useState } from 'react'
import type { VoiceChatState } from '../model/types'

interface UseLiveKitProps {
  roomName: string
  userName: string
  userId: string
  onError?: (error: string) => void
  onStatusChange?: (status: VoiceChatState) => void
}

/**
 * LiveKit을 사용한 음성채팅 훅
 */
export function useLiveKit({
  roomName,
  userName,
  userId,
  onError,
  onStatusChange,
}: UseLiveKitProps) {
  // 상태 관리
  const [room, setRoom] = useState<Room | null>(null)
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected,
  )
  const [error, setError] = useState<string | null>(null)
  const [participants, setParticipants] = useState<RemoteParticipant[]>([])
  const [localParticipant, setLocalParticipant] =
    useState<LocalParticipant | null>(null)
  const [speakingParticipants, setSpeakingParticipants] = useState<Set<string>>(
    new Set(),
  )

  // 참조
  const roomRef = useRef<Room | null>(null)
  const remoteAudioRefs = useRef<Map<string, HTMLAudioElement>>(new Map())
  const isConnectingRef = useRef(false)

  // 계산된 상태
  const isConnected = connectionState === ConnectionState.Connected
  const isConnecting = connectionState === ConnectionState.Connecting
  const isDisconnected = connectionState === ConnectionState.Disconnected

  // LiveKit 토큰 생성
  const getToken = async (
    roomName: string,
    userName: string,
    userId: string,
  ) => {
    const response = await fetch('/api/livekit/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: roomName,
        identity: `user_${userId}`,
        name: userName,
      }),
    })

    if (!response.ok) {
      throw new Error('토큰 생성 실패')
    }

    const data = await response.json()
    return data.token
  }

  // 오디오 요소 생성 및 관리
  const createAudioElement = (
    participantIdentity: string,
  ): HTMLAudioElement => {
    const audioElement = document.createElement('audio')
    audioElement.autoplay = true
    audioElement.setAttribute('playsinline', 'true')

    remoteAudioRefs.current.set(participantIdentity, audioElement)
    document.body.appendChild(audioElement)

    return audioElement
  }

  // 오디오 요소 정리
  const removeAudioElement = (participantIdentity: string): void => {
    const audioElement = remoteAudioRefs.current.get(participantIdentity)
    if (audioElement) {
      audioElement.remove()
      remoteAudioRefs.current.delete(participantIdentity)
    }
  }

  // Room 이벤트 리스너 설정
  const setupRoomEventListeners = (room: Room) => {
    // 연결 상태 변경
    room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
      setConnectionState(state)

      if (state === ConnectionState.Connected) {
        setLocalParticipant(room.localParticipant)
        setError(null)
      }
    })

    // 연결 끊김
    room.on(RoomEvent.Disconnected, (reason?: DisconnectReason) => {
      setConnectionState(ConnectionState.Disconnected)
      setLocalParticipant(null)
      setParticipants([])
      setSpeakingParticipants(new Set())

      if (reason && reason !== DisconnectReason.CLIENT_INITIATED) {
        setError('예상치 못한 연결 끊김이 발생했습니다.')
      }
    })

    // 참여자 관리
    room.on(
      RoomEvent.ParticipantConnected,
      (participant: RemoteParticipant) => {
        setParticipants(prev => [...prev, participant])
      },
    )

    room.on(
      RoomEvent.ParticipantDisconnected,
      (participant: RemoteParticipant) => {
        setParticipants(prev =>
          prev.filter(p => p.identity !== participant.identity),
        )
        removeAudioElement(participant.identity)
      },
    )

    // 트랙 구독 관리
    room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
      if (
        track.kind === Track.Kind.Audio &&
        participant instanceof RemoteParticipant
      ) {
        const audioElement = createAudioElement(participant.identity)
        const remoteTrack = track as RemoteAudioTrack
        remoteTrack.attach(audioElement)
      }
    })

    room.on(RoomEvent.TrackUnsubscribed, (track, _publication, participant) => {
      if (track.kind === Track.Kind.Audio) {
        const audioElement = remoteAudioRefs.current.get(participant.identity)
        if (audioElement) {
          track.detach(audioElement)
          removeAudioElement(participant.identity)
        }
      }
    })

    // 트랙 상태 변경
    room.on(RoomEvent.TrackMuted, (_publication, participant) => {
      if (participant === room.localParticipant) {
        setLocalParticipant(room.localParticipant)
      }
    })

    room.on(RoomEvent.TrackUnmuted, (_publication, participant) => {
      if (participant === room.localParticipant) {
        setLocalParticipant(room.localParticipant)
      }
    })

    // 로컬 트랙 발행 상태 변경
    room.on(RoomEvent.LocalTrackPublished, (_publication, participant) => {
      setLocalParticipant(participant)
    })

    room.on(RoomEvent.LocalTrackUnpublished, (_publication, participant) => {
      setLocalParticipant(participant)
    })

    // 음성 활동 감지
    room.on(RoomEvent.ActiveSpeakersChanged, speakers => {
      const speakingSet = new Set<string>()
      speakers.forEach(speaker => {
        if (speaker.identity) {
          speakingSet.add(speaker.identity)
        }
      })
      setSpeakingParticipants(speakingSet)
    })
  }

  // 연결
  const connect = async () => {
    if (isConnectingRef.current || isConnected) return

    try {
      isConnectingRef.current = true
      setConnectionState(ConnectionState.Connecting)
      setError(null)

      // 마이크 권한 요청
      await navigator.mediaDevices.getUserMedia({ audio: true })

      // 토큰 생성
      const token = await getToken(roomName, userName, userId)

      // LiveKit URL 검증
      const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL
      if (!livekitUrl) {
        throw new Error(
          'NEXT_PUBLIC_LIVEKIT_URL 환경변수가 설정되지 않았습니다.',
        )
      }

      // Room 생성 및 설정
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      // 이벤트 리스너 설정
      setupRoomEventListeners(newRoom)

      // 연결
      await newRoom.connect(livekitUrl, token)

      // 마이크 트랙 발행
      await newRoom.localParticipant.setMicrophoneEnabled(true)

      setRoom(newRoom)
      roomRef.current = newRoom
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '연결 실패'
      setError(errorMessage)
      setConnectionState(ConnectionState.Disconnected)
      onError?.(errorMessage)
    } finally {
      isConnectingRef.current = false
    }
  }

  // 연결 해제
  const disconnect = async () => {
    const currentRoom = roomRef.current
    if (currentRoom) {
      await currentRoom.disconnect()

      // 모든 오디오 요소 정리
      remoteAudioRefs.current.forEach(audioElement => {
        audioElement.remove()
      })
      remoteAudioRefs.current.clear()

      setRoom(null)
      roomRef.current = null
      setConnectionState(ConnectionState.Disconnected)
      setError(null)
      setParticipants([])
      setLocalParticipant(null)
      setSpeakingParticipants(new Set())
    }
  }

  // 마이크 토글
  const toggleMicrophone = async () => {
    const currentRoom = roomRef.current
    if (!currentRoom || !localParticipant) return

    try {
      const isEnabled = localParticipant.isMicrophoneEnabled
      await localParticipant.setMicrophoneEnabled(!isEnabled)
    } catch (err) {
      console.error('마이크 토글 실패:', err)
    }
  }

  // 상태 변경 콜백 호출
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange({
        isConnected,
        isConnecting,
        hasError: !!error,
        isDisconnected,
        isMicrophoneEnabled: localParticipant?.isMicrophoneEnabled ?? false,
        isSpeaking: speakingParticipants.has(`user_${userId}`),
        ...(error && { error }),
      })
    }
  }, [
    isConnected,
    isConnecting,
    error,
    isDisconnected,
    localParticipant?.isMicrophoneEnabled,
    speakingParticipants,
    userId,
    onStatusChange,
  ])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      const currentRoom = roomRef.current
      if (currentRoom) {
        currentRoom.disconnect()
        remoteAudioRefs.current.forEach(audioElement => {
          audioElement.remove()
        })
        remoteAudioRefs.current.clear()
      }
    }
  }, [])

  return {
    // 상태
    room,
    isConnected,
    isConnecting,
    error,
    participants,
    localParticipant,
    speakingParticipants,
    remoteAudioRefs,

    // 액션
    connect,
    disconnect,
    toggleMicrophone,
  }
}
