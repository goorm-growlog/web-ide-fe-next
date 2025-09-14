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
  function getMicrophoneEnabled(participant: RemoteParticipant): boolean {
    const audioTracks = Array.from(
      participant.audioTrackPublications?.values() || [],
    ).filter(track => track.kind === Track.Kind.Audio)

    if (audioTracks.length > 0) {
      return audioTracks.some(track => !track.isMuted)
    }

    return participant.isMicrophoneEnabled
  }

  // 참여자 상태 동기화 - LiveKit 권장 방식
  const syncParticipants = () => {
    if (!room) return

    const remoteParticipants = Array.from(room.remoteParticipants.values())
    const newParticipants: Participant[] = remoteParticipants.map(
      participant => ({
        identity: participant.identity,
        name: participant.name || participant.identity,
        isMicrophoneEnabled: getMicrophoneEnabled(participant),
        isSpeaking: speakingParticipants.has(participant.identity),
        volume: 100,
      }),
    )

    setParticipants(prev => {
      // 참여자 순서 유지하면서 업데이트
      const updated = newParticipants.map(newParticipant => {
        const existing = prev.find(p => p.identity === newParticipant.identity)
        return existing ? { ...existing, ...newParticipant } : newParticipant
      })

      // 새로 추가된 참여자들만 추가
      const existingIdentities = new Set(updated.map(p => p.identity))
      const newOnly = prev.filter(p => !existingIdentities.has(p.identity))

      return [...updated, ...newOnly]
    })
  }

  // Room 이벤트 리스너 설정 - 중복 방지
  const setupRoomEventListeners = (room: Room) => {
    if (eventListenersSetup.current) return
    eventListenersSetup.current = true

    console.log('Setting up room event listeners')

    // 연결 상태 변경
    room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
      console.log(`Connection state changed: ${state}`)
      setConnectionState(state)
      isConnectingRef.current = false

      if (state === ConnectionState.Connected) {
        setError(null)
        setLocalParticipant(room.localParticipant)

        // 연결 시 기존 참여자들 즉시 로드
        const existingParticipants = Array.from(
          room.remoteParticipants.values(),
        )
        const initialParticipants: Participant[] = existingParticipants.map(
          participant => ({
            identity: participant.identity,
            name: participant.name || participant.identity,
            isMicrophoneEnabled: getMicrophoneEnabled(participant),
            isSpeaking: false,
            volume: 100,
          }),
        )
        setParticipants(initialParticipants)
        console.log(
          `Loaded existing participants:`,
          initialParticipants.map(p => p.identity),
        )

        // 참여자 상태 동기화 (백업용)
        setTimeout(syncParticipants, 100)
      } else if (state === ConnectionState.Disconnected) {
        setParticipants([])
        setLocalParticipant(null)
        setSpeakingParticipants(new Set())
      }
    })

    // 연결 해제
    room.on(RoomEvent.Disconnected, (reason?: DisconnectReason) => {
      console.log('Disconnected:', reason)
      if (reason === DisconnectReason.ERROR) {
        setError('연결 오류가 발생했습니다')
      }
    })

    // 활성 스피커 변경
    room.on(
      RoomEvent.ActiveSpeakersChanged,
      (speakers: RemoteParticipant[]) => {
        const speakingSet = new Set(speakers.map(speaker => speaker.identity))
        setSpeakingParticipants(speakingSet)
      },
    )

    // 트랙 구독/구독 해제
    room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
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

    room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      if (
        track.kind === Track.Kind.Audio &&
        participant instanceof RemoteParticipant
      ) {
        track.detach()
        removeAudioElement(participant.identity)
      }
    })

    // 트랙 상태 변경 - 실시간 업데이트
    room.on(RoomEvent.TrackMuted, (publication, participant) => {
      if (publication.kind === Track.Kind.Audio) {
        console.log(`🔇 TrackMuted: ${participant.identity}`)
        if (participant === room.localParticipant) {
          setLocalParticipant(room.localParticipant)
        } else {
          // 원격 참여자 상태 즉시 업데이트
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
        console.log(`🔊 TrackUnmuted: ${participant.identity}`)
        if (participant === room.localParticipant) {
          setLocalParticipant(room.localParticipant)
        } else {
          // 원격 참여자 상태 즉시 업데이트
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

    // 참여자 연결/해제 - 실시간 업데이트
    room.on(
      RoomEvent.ParticipantConnected,
      (participant: RemoteParticipant) => {
        console.log(`Participant connected: ${participant.identity}`)

        // 새 참여자 즉시 추가
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
          console.log(`Added participant: ${participant.identity}`)
          return [...prev, newParticipant]
        })
      },
    )

    room.on(
      RoomEvent.ParticipantDisconnected,
      (participant: RemoteParticipant) => {
        console.log(`Participant disconnected: ${participant.identity}`)

        // 참여자 즉시 제거
        setParticipants(prev => {
          const updated = prev.filter(p => p.identity !== participant.identity)
          console.log(`Removed participant: ${participant.identity}`)
          return updated
        })
      },
    )
  }

  // 오디오 요소 제거
  const removeAudioElement = (participantIdentity: string) => {
    const audioElement = remoteAudioRefs.current.get(participantIdentity)
    if (audioElement) {
      audioElement.remove()
      remoteAudioRefs.current.delete(participantIdentity)
    }
  }

  // 연결
  const connect = async () => {
    if (isConnectingRef.current || isConnected) return

    isConnectingRef.current = true
    setConnectionState(ConnectionState.Connecting)
    setError(null)

    try {
      // 1. 마이크 권한과 토큰을 병렬로 요청
      const [_, tokenResponse] = await Promise.all([
        navigator.mediaDevices.getUserMedia({ audio: true }),
        fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room: roomName,
            identity: `user_${userId}`,
            name: userName,
          }),
        }),
      ])

      const tokenData = await tokenResponse.json()
      const token = tokenData.token

      // 2. LiveKit Room 생성 및 연결
      const newRoom = new Room({
        publishDefaults: {
          audioPreset: {
            maxBitrate: 64000, // 낮은 비트레이트로 빠른 연결
          },
        },
      })

      // 3. 이벤트 리스너 설정
      setupRoomEventListeners(newRoom)

      // 4. 연결 (타임아웃 포함)
      const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL
      if (!livekitUrl) throw new Error('LiveKit URL이 설정되지 않았습니다')

      const connectPromise = newRoom.connect(livekitUrl, token)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('연결 시간 초과 (10초)')), 10000),
      )

      await Promise.race([connectPromise, timeoutPromise])

      // 5. 연결 완료 후 마이크 트랙 발행
      newRoom.localParticipant
        .setMicrophoneEnabled(true)
        .catch(err => console.warn('마이크 활성화 실패:', err))

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
      // 1. 즉시 UI 상태 업데이트 (낙관적 업데이트)
      setLocalParticipant(prev =>
        prev ? { ...prev, isMicrophoneEnabled: newState } : null,
      )

      // 2. LiveKit API 호출
      await currentRoom.localParticipant.setMicrophoneEnabled(newState)

      // 3. 성공 시 실제 상태로 동기화
      setLocalParticipant(currentRoom.localParticipant)

      console.log(`Microphone toggled: ${newState}`)
    } catch (err) {
      console.error('마이크 토글 실패:', err)

      // 4. 실패 시 이전 상태로 롤백
      setLocalParticipant(prev =>
        prev ? { ...prev, isMicrophoneEnabled: !newState } : null,
      )
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
        error,
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
  }, [roomName, userName, userId])

  // 참여자 상태 주기적 동기화 - LiveKit 권장 방식
  useEffect(() => {
    if (!isConnected || !room) return

    const interval = setInterval(syncParticipants, 300) // 300ms마다 동기화

    return () => clearInterval(interval)
  }, [isConnected, room, speakingParticipants])

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

  // 최종 participants 결과 로그
  if (process.env.NODE_ENV === 'development' && participants.length > 0) {
    console.log(
      'Final participants for UI:',
      participants.map(p => ({
        identity: p.identity,
        isMicrophoneEnabled: p.isMicrophoneEnabled,
      })),
    )
  }

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
  }
}
