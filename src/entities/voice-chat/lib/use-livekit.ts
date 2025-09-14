import {
  ConnectionState,
  DisconnectReason,
  type LocalParticipant,
  RemoteParticipant,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { Participant, VoiceChatState } from '../model/types'

interface UseLiveKitProps {
  roomName: string
  userName: string
  userId: string
  onError?: (error: string) => void
  onStatusChange?: (status: VoiceChatState) => void
}

/**
 * LiveKit을 사용한 음성채팅 훅 - LiveKit 권장 패턴 적용
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
  const [participants, setParticipants] = useState<Participant[]>([])
  const [localParticipant, setLocalParticipant] =
    useState<LocalParticipant | null>(null)
  const [speakingParticipants, setSpeakingParticipants] = useState<Set<string>>(
    new Set(),
  )
  const [isTogglingMicrophone, setIsTogglingMicrophone] = useState(false)

  // 개별 볼륨 상태 관리 (localStorage 연동)
  const [participantVolumes, setParticipantVolumes] = useState<
    Record<string, number>
  >({})

  // 참조
  const roomRef = useRef<Room | null>(null)
  const remoteAudioRefs = useRef<Map<string, HTMLAudioElement>>(new Map())
  const isConnectingRef = useRef(false)
  const eventListenersSetup = useRef(false)

  // 계산된 상태
  const isConnected = connectionState === ConnectionState.Connected
  const isConnecting = connectionState === ConnectionState.Connecting
  const isDisconnected = connectionState === ConnectionState.Disconnected
  const hasError = !!error

  // LiveKit 문서에 따른 마이크 상태 확인 함수
  const getMicrophoneEnabled = useCallback(
    (participant: RemoteParticipant): boolean => {
      const audioTracks = Array.from(
        participant.audioTrackPublications?.values() || [],
      ).filter(track => track.kind === Track.Kind.Audio)

      if (audioTracks.length > 0) {
        return audioTracks.some(track => !track.isMuted)
      }

      return participant.isMicrophoneEnabled
    },
    [],
  )

  // localStorage에서 볼륨 설정 로드
  const loadVolumeSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem('voice-chat-volumes')
      if (saved) {
        const volumes = JSON.parse(saved)
        setParticipantVolumes(volumes)
        return volumes
      }
    } catch {
      // 볼륨 설정 로드 실패 시 기본값 사용
    }
    return {}
  }, [])

  // localStorage에 볼륨 설정 저장
  const saveVolumeSettings = useCallback((volumes: Record<string, number>) => {
    try {
      localStorage.setItem('voice-chat-volumes', JSON.stringify(volumes))
    } catch {
      // 볼륨 설정 저장 실패 시 무시
    }
  }, [])

  // 개별 참여자 볼륨 조절
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setParticipantVolume = useCallback(
    (participantIdentity: string, volume: number) => {
      setParticipantVolumes(prev => {
        const newVolumes = { ...prev, [participantIdentity]: volume }
        saveVolumeSettings(newVolumes)
        return newVolumes
      })

      // 참여자 상태 즉시 업데이트
      setParticipants(prev => {
        const updated = prev.map(p =>
          p.identity === participantIdentity ? { ...p, volume } : p,
        )
        return updated
      })

      // LiveKit API로 실제 볼륨 설정
      const currentRoom = roomRef.current
      if (currentRoom) {
        const participant =
          currentRoom.remoteParticipants.get(participantIdentity)
        if (participant) {
          participant.setVolume(volume / 100) // LiveKit은 0-1 범위 사용
        }
      }
    },
    [saveVolumeSettings],
  )

  // 참여자 볼륨 가져오기 (기본값 100)
  const getParticipantVolume = (participantIdentity: string): number => {
    return participantVolumes[participantIdentity] ?? 100
  }

  // 참여자 상태 동기화 - 백업용 (볼륨은 기존 값 유지)
  const syncParticipants = useCallback(() => {
    if (!room) return

    const remoteParticipants = Array.from(room.remoteParticipants.values())

    setParticipants(prev => {
      const newParticipants: Participant[] = remoteParticipants.map(
        participant => {
          const existing = prev.find(p => p.identity === participant.identity)
          return {
            identity: participant.identity,
            name: participant.name || participant.identity,
            isMicrophoneEnabled: getMicrophoneEnabled(participant),
            isSpeaking: speakingParticipants.has(participant.identity),
            volume:
              existing?.volume ??
              participantVolumes[participant.identity] ??
              100, // 기존 볼륨 유지
          }
        },
      )

      return newParticipants
    })
  }, [room, speakingParticipants, participantVolumes, getMicrophoneEnabled])

  // 오디오 요소 제거
  const removeAudioElement = useCallback((participantIdentity: string) => {
    const audioElement = remoteAudioRefs.current.get(participantIdentity)
    if (audioElement) {
      audioElement.remove()
      remoteAudioRefs.current.delete(participantIdentity)
    }
  }, [])

  // Room 이벤트 리스너 설정 - 중복 방지
  const setupRoomEventListeners = useCallback(
    (room: Room) => {
      if (eventListenersSetup.current) return
      eventListenersSetup.current = true

      // 연결 상태 변경
      room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
        setConnectionState(state)
        isConnectingRef.current = false

        if (state === ConnectionState.Connected) {
          setError(null)
          setLocalParticipant(room.localParticipant)
          // 기존 참여자들 로드
          syncParticipants()
        } else if (state === ConnectionState.Disconnected) {
          setParticipants([])
          setLocalParticipant(null)
          setSpeakingParticipants(new Set())
        }
      })

      // 연결 해제
      room.on(RoomEvent.Disconnected, (reason?: DisconnectReason) => {
        if (reason === DisconnectReason.CLIENT_INITIATED) {
          setError('연결 오류가 발생했습니다')
        }
      })

      // 활성 스피커 변경
      room.on(
        RoomEvent.ActiveSpeakersChanged,
        (speakers: import('livekit-client').Participant[]) => {
          const speakingSet = new Set(speakers.map(speaker => speaker.identity))
          setSpeakingParticipants(speakingSet)
        },
      )

      // 트랙 구독/구독 해제
      room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
        if (
          track.kind === Track.Kind.Audio &&
          participant instanceof RemoteParticipant
        ) {
          const audioElement = track.attach()
          audioElement.autoplay = true
          audioElement.muted = false
          remoteAudioRefs.current.set(participant.identity, audioElement)
          document.body.appendChild(audioElement)
        }
      })

      room.on(
        RoomEvent.TrackUnsubscribed,
        (track, _publication, participant) => {
          if (
            track.kind === Track.Kind.Audio &&
            participant instanceof RemoteParticipant
          ) {
            track.detach()
            removeAudioElement(participant.identity)
          }
        },
      )

      // 트랙 상태 변경 - 실시간 업데이트
      room.on(RoomEvent.TrackMuted, (publication, participant) => {
        if (publication.kind === Track.Kind.Audio) {
          if (participant === room.localParticipant) {
            setLocalParticipant(room.localParticipant)
          } else {
            setParticipants(prev =>
              prev.map(p =>
                p.identity === participant.identity
                  ? { ...p, isMicrophoneEnabled: false }
                  : p,
              ),
            )
          }
        }
      })

      room.on(RoomEvent.TrackUnmuted, (publication, participant) => {
        if (publication.kind === Track.Kind.Audio) {
          if (participant === room.localParticipant) {
            setLocalParticipant(room.localParticipant)
          } else {
            setParticipants(prev =>
              prev.map(p =>
                p.identity === participant.identity
                  ? { ...p, isMicrophoneEnabled: true }
                  : p,
              ),
            )
          }
        }
      })

      // 로컬 트랙 발행 상태 변경
      room.on(RoomEvent.LocalTrackPublished, (_publication, participant) => {
        setLocalParticipant(participant)
      })

      room.on(RoomEvent.LocalTrackUnpublished, (_publication, participant) => {
        setLocalParticipant(participant)
      })

      // 참여자 연결/해제 - 실시간 업데이트 (순서 유지)
      room.on(
        RoomEvent.ParticipantConnected,
        (participant: RemoteParticipant) => {
          const newParticipant: Participant = {
            identity: participant.identity,
            name: participant.name || participant.identity,
            isMicrophoneEnabled: getMicrophoneEnabled(participant),
            isSpeaking: false,
            volume: 100,
          }

          setParticipants(prev => {
            // 중복 방지
            if (prev.some(p => p.identity === participant.identity)) {
              return prev
            }

            // 순서 유지: 기존 참여자들 뒤에 새 참여자 추가
            return [...prev, newParticipant]
          })
        },
      )

      room.on(
        RoomEvent.ParticipantDisconnected,
        (participant: RemoteParticipant) => {
          setParticipants(prev => {
            // 순서 유지: 해당 참여자만 제거하고 나머지 순서 유지
            return prev.filter(p => p.identity !== participant.identity)
          })
        },
      )
    },
    [syncParticipants, getMicrophoneEnabled, removeAudioElement],
  )

  // 연결
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connect = useCallback(async () => {
    if (isConnectingRef.current || isConnected) return

    isConnectingRef.current = true
    setConnectionState(ConnectionState.Connecting)
    setError(null)

    try {
      // 1. 마이크 권한 확인 및 요청
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (error) {
        // NotAllowedError는 사용자가 권한을 거부한 경우
        if (error instanceof Error && error.name === 'NotAllowedError') {
          toast.error(
            'Please allow microphone access in your browser settings to use voice chat.',
          )
        } else {
          toast.error('Failed to connect microphone. Please try again.')
        }
        throw new Error('Microphone permission is required.')
      }

      // 2. 토큰 요청
      const tokenResponse = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room: roomName,
          identity: `user_${userId}`,
          name: userName,
        }),
      })

      const tokenData = await tokenResponse.json()
      const token = tokenData.token

      // 3. LiveKit Room 생성 및 연결
      const newRoom = new Room({
        publishDefaults: {
          audioPreset: {
            maxBitrate: 64000, // 낮은 비트레이트로 빠른 연결
          },
        },
      })

      // 4. 이벤트 리스너 설정
      setupRoomEventListeners(newRoom)

      // 5. 연결 (타임아웃 포함)
      const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL
      if (!livekitUrl) throw new Error('LiveKit URL이 설정되지 않았습니다')

      const connectPromise = newRoom.connect(livekitUrl, token)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('연결 시간 초과 (10초)')), 10000),
      )

      await Promise.race([connectPromise, timeoutPromise])

      // 6. 연결 완료 후 마이크 트랙 발행 (뮤트 상태로 시작)
      await newRoom.localParticipant.setMicrophoneEnabled(false)

      // 7. 볼륨 설정 로드
      loadVolumeSettings()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConnected,
    roomName,
    userId,
    userName,
    onError,
    loadVolumeSettings,
    setupRoomEventListeners,
  ])

  // 연결 해제
  const disconnect = async () => {
    const currentRoom = roomRef.current
    if (currentRoom) {
      await currentRoom.disconnect()
      eventListenersSetup.current = false

      // 모든 오디오 요소 정리
      remoteAudioRefs.current.forEach(audioElement => {
        audioElement.remove()
      })
      remoteAudioRefs.current.clear()
    }
  }

  // 마이크 토글 - LiveKit 권장 방식
  const toggleMicrophone = async () => {
    const currentRoom = roomRef.current
    if (!currentRoom || !localParticipant || isTogglingMicrophone) return

    const isEnabled = localParticipant.isMicrophoneEnabled
    const newState = !isEnabled

    setIsTogglingMicrophone(true)

    try {
      // 2. LiveKit API 호출
      await currentRoom.localParticipant.setMicrophoneEnabled(newState)

      // 3. 성공 시 실제 상태로 동기화
      setLocalParticipant(currentRoom.localParticipant)
    } catch (err) {
      // 4. 실패 시 원래 상태로 재설정
      setLocalParticipant(currentRoom.localParticipant)
      onError?.(
        `마이크 토글 실패: ${err instanceof Error ? err.message : '알 수 없는 오류'}`,
      )
    } finally {
      setIsTogglingMicrophone(false)
    }
  }

  // 상태 변경 콜백 호출
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange({
        isConnected,
        isConnecting,
        hasError,
        isDisconnected,
        isMicrophoneEnabled: localParticipant?.isMicrophoneEnabled ?? false,
        isSpeaking: speakingParticipants.has(`user_${userId}`),
        error: error ?? '',
      })
    }
  }, [
    isConnected,
    isConnecting,
    hasError,
    isDisconnected,
    localParticipant?.isMicrophoneEnabled,
    speakingParticipants,
    userId,
    onStatusChange,
    error,
  ])

  // 자동 연결
  useEffect(() => {
    if (!isConnected && !isConnecting && !error) {
      connect()
    }
  }, [connect, isConnected, isConnecting, error])

  // 참여자 상태 주기적 동기화 - 백업용
  useEffect(() => {
    if (!isConnected || !room) return

    const interval = setInterval(syncParticipants, 1000) // 1초마다 동기화

    return () => clearInterval(interval)
  }, [isConnected, room, syncParticipants])

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
    participants, // UI용으로 변환된 참여자 데이터
    localParticipant,
    speakingParticipants,
    remoteAudioRefs,
    isTogglingMicrophone,

    // 액션
    connect,
    disconnect,
    toggleMicrophone,

    // 볼륨 관리
    setParticipantVolume,
    getParticipantVolume,
    participantVolumes,
  }
}
