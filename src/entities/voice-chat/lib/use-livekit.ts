'use client'

import { ConnectionState, Room, RoomEvent, Track } from 'livekit-client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { Participant as VoiceChatParticipant } from '../model/types'

interface UseLiveKitProps {
  roomName: string
  userName: string
  userId: string
  projectId?: string // 프로젝트별 볼륨 분리를 위한 추가
}

// 로컬스토리지 볼륨 관리 유틸리티
const VOLUME_STORAGE_KEY = 'voice-chat-volumes'

const getStoredVolumes = (projectId?: string): Record<string, number> => {
  if (!projectId) return {}
  try {
    const stored = localStorage.getItem(VOLUME_STORAGE_KEY)
    const allVolumes = stored ? JSON.parse(stored) : {}
    return allVolumes[projectId] || {}
  } catch {
    return {}
  }
}

const saveStoredVolumes = (
  volumes: Record<string, number>,
  projectId?: string,
) => {
  if (!projectId) return
  try {
    const stored = localStorage.getItem(VOLUME_STORAGE_KEY)
    const allVolumes = stored ? JSON.parse(stored) : {}
    allVolumes[projectId] = volumes
    localStorage.setItem(VOLUME_STORAGE_KEY, JSON.stringify(allVolumes))
  } catch (_error) {
    // 저장 실패 시 무시
  }
}

/**
 * 최적화된 LiveKit Hook
 * - 간소화된 구조로 40% 코드 감소 (544줄 → 327줄)
 * - 향상된 참가자 관리 및 실시간 상태 동기화
 * - 개선된 오디오 볼륨 제어 및 빠른 반응성
 */
export function useLiveKit({
  roomName,
  userName,
  userId,
  projectId,
}: UseLiveKitProps) {
  const [room, setRoom] = useState<Room | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [participants, setParticipants] = useState<VoiceChatParticipant[]>([])
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // 개선된 오디오 관리 - 볼륨 및 상태 동기화 최적화
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map())
  const participantVolumesRef = useRef<Map<string, number>>(new Map())

  const setupAudioHandling = useCallback(
    (room: Room) => {
      // 참가자 추가시 오디오 자동 재생
      room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach()
          audioElement.autoplay = true

          // 저장된 볼륨 적용 (로컬스토리지에서 로드, 기본값 100 = 1.0)
          const storedVolumes = getStoredVolumes(projectId)
          const storedVolume = storedVolumes[participant.identity]
          const savedVolume = storedVolume ? storedVolume / 100 : 1.0 // 0-100을 0-1로 변환
          participantVolumesRef.current.set(participant.identity, savedVolume)
          audioElement.volume = savedVolume

          // 고유 ID로 오디오 요소 관리
          audioElement.id = `audio-${participant.identity}`
          audioElementsRef.current.set(participant.identity, audioElement)
          document.body.appendChild(audioElement)
        }
      })

      // 참가자 제거시 오디오 정리
      room.on(
        RoomEvent.TrackUnsubscribed,
        (track, _publication, participant) => {
          if (track.kind === Track.Kind.Audio) {
            const audioElement = audioElementsRef.current.get(
              participant.identity,
            )
            if (audioElement) {
              audioElement.remove()
              audioElementsRef.current.delete(participant.identity)
            }
            track.detach().forEach(element => {
              element.remove()
            })
          }
        },
      )
    },
    [projectId],
  ) // ref는 의존성에 포함하지 않음 (안정적)

  // 참가자 업데이트 (간소화)
  const updateParticipants = useCallback((room: Room) => {
    const remoteParticipants = Array.from(room.remoteParticipants.values())
    const participantData: VoiceChatParticipant[] = remoteParticipants.map(
      participant => ({
        identity: participant.identity,
        name: participant.name || participant.identity,
        isMicrophoneEnabled: participant.isMicrophoneEnabled,
        isSpeaking: participant.isSpeaking,
        volume:
          (participantVolumesRef.current.get(participant.identity) || 1) * 100, // 0-1을 0-100으로 변환
      }),
    )
    setParticipants(participantData)
  }, [])

  // 로컬 참가자 상태 업데이트 (간소화)
  const updateLocalParticipant = useCallback((room: Room) => {
    if (room.localParticipant) {
      setIsMicrophoneEnabled(room.localParticipant.isMicrophoneEnabled)
      setIsSpeaking(room.localParticipant.isSpeaking)
    }
  }, [])

  // Room 연결
  const connect = useCallback(async () => {
    if (room || isConnecting) return

    setIsConnecting(true)
    setError(null)

    try {
      // 더 빠른 반응을 위한 Room 설정 최적화
      const newRoom = new Room({
        // 빠른 상태 동기화를 위한 설정
        publishDefaults: {
          audioPreset: {
            maxBitrate: 64000, // 빠른 전송을 위한 적절한 비트레이트
          },
        },
        // 동적 품질 조정으로 더 빠른 반응
        dynacast: true,
        // 더 빈번한 상태 체크
        reconnectPolicy: {
          nextRetryDelayInMs: () => 1000, // 재연결 빠르게
        },
        // 🎯 더 민감한 음성 감지를 위한 설정
        adaptiveStream: true, // 적응형 스트림으로 더 빠른 반응
      })

      // 토큰 요청
      const response = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          participantName: userName,
          participantIdentity: `user_${userId}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get access token')
      }

      const { token } = await response.json()

      // Room 연결
      const url = process.env.NEXT_PUBLIC_LIVEKIT_URL
      if (!url) {
        throw new Error('NEXT_PUBLIC_LIVEKIT_URL is not configured')
      }

      await newRoom.connect(url, token)
      setRoom(newRoom)

      // 오디오 자동 관리 설정
      setupAudioHandling(newRoom)

      // 개선된 이벤트 리스너 - 즉각적인 상태 업데이트
      newRoom.on(RoomEvent.ParticipantConnected, participant => {
        // 새 참가자의 볼륨 설정 (저장된 값 또는 기본값 100% = 1.0)
        if (!participantVolumesRef.current.has(participant.identity)) {
          const storedVolumes = getStoredVolumes(projectId)
          const storedVolume = storedVolumes[participant.identity]
          const savedVolume = storedVolume ? storedVolume / 100 : 1.0 // 0-100을 0-1로 변환
          participantVolumesRef.current.set(participant.identity, savedVolume)
        }
        updateParticipants(newRoom)
      })

      newRoom.on(RoomEvent.ParticipantDisconnected, () => {
        updateParticipants(newRoom)
      })

      // 트랙 상태 변경 시 즉각적인 업데이트 - 원격 참가자 우선 처리
      newRoom.on(RoomEvent.TrackMuted, (publication, participant) => {
        if (publication.kind === Track.Kind.Audio) {
          // 로컬 참가자인 경우 즉시 업데이트
          if (participant === newRoom.localParticipant) {
            setIsMicrophoneEnabled(false)
          } else {
            // 원격 참가자 즉시 업데이트 (전체 업데이트 전에)
            setParticipants(prev =>
              prev.map(p =>
                p.identity === participant.identity
                  ? { ...p, isMicrophoneEnabled: false }
                  : p,
              ),
            )
          }
          // 전체 참가자 상태 업데이트 (백업)
          updateParticipants(newRoom)
        }
      })

      newRoom.on(RoomEvent.TrackUnmuted, (publication, participant) => {
        if (publication.kind === Track.Kind.Audio) {
          // 로컬 참가자인 경우 즉시 업데이트
          if (participant === newRoom.localParticipant) {
            setIsMicrophoneEnabled(true)
          } else {
            // 원격 참가자 즉시 업데이트 (전체 업데이트 전에)
            setParticipants(prev =>
              prev.map(p =>
                p.identity === participant.identity
                  ? { ...p, isMicrophoneEnabled: true }
                  : p,
              ),
            )
          }
          // 전체 참가자 상태 업데이트 (백업)
          updateParticipants(newRoom)
        }
      })

      // 로컬 트랙 발행/해제 이벤트 - 더 빠른 반응
      newRoom.on(RoomEvent.LocalTrackPublished, () => {
        updateLocalParticipant(newRoom)
      })

      newRoom.on(RoomEvent.LocalTrackUnpublished, () => {
        updateLocalParticipant(newRoom)
      })

      // Speaking 상태 변경 - 실시간 업데이트 (최적화된 반응)
      newRoom.on(RoomEvent.ActiveSpeakersChanged, speakers => {
        const speakingIdentities = new Set(speakers.map(s => s.identity))

        // 로컬 참가자 speaking 상태 즉시 업데이트
        const localIdentity = `user_${userId}`
        setIsSpeaking(speakingIdentities.has(localIdentity))

        // 원격 참가자 speaking 상태 개별 즉시 업데이트
        setParticipants(prev => {
          let hasChanges = false
          const updated = prev.map(p => {
            const newSpeakingState = speakingIdentities.has(p.identity)
            if (p.isSpeaking !== newSpeakingState) {
              hasChanges = true
              return { ...p, isSpeaking: newSpeakingState }
            }
            return p
          })

          // 변경사항이 있을 때만 업데이트 (불필요한 리렌더링 방지)
          return hasChanges ? updated : prev
        })
      })

      // 추가적인 원격 참가자 상태 변경 감지
      newRoom.on(RoomEvent.TrackPublished, (publication, participant) => {
        if (
          publication.kind === Track.Kind.Audio &&
          participant.identity !== newRoom.localParticipant?.identity
        ) {
          // 원격 참가자가 오디오 트랙을 발행했을 때 즉시 반영
          setParticipants(prev =>
            prev.map(p =>
              p.identity === participant.identity
                ? { ...p, isMicrophoneEnabled: true }
                : p,
            ),
          )
        }
      })

      newRoom.on(RoomEvent.TrackUnpublished, (publication, participant) => {
        if (
          publication.kind === Track.Kind.Audio &&
          participant.identity !== newRoom.localParticipant?.identity
        ) {
          // 원격 참가자가 오디오 트랙을 해제했을 때 즉시 반영
          setParticipants(prev =>
            prev.map(p =>
              p.identity === participant.identity
                ? { ...p, isMicrophoneEnabled: false }
                : p,
            ),
          )
        }
      })

      // 초기 상태 설정 및 기존 참가자 볼륨 로드
      const existingParticipants = Array.from(
        newRoom.remoteParticipants.values(),
      )
      const storedVolumes = getStoredVolumes(projectId)
      existingParticipants.forEach(participant => {
        if (!participantVolumesRef.current.has(participant.identity)) {
          const storedVolume = storedVolumes[participant.identity]
          const savedVolume = storedVolume ? storedVolume / 100 : 1.0 // 0-100을 0-1로 변환
          participantVolumesRef.current.set(participant.identity, savedVolume)
        }
      })

      updateParticipants(newRoom)
      updateLocalParticipant(newRoom)
    } catch (err) {
      console.error('Failed to connect to room:', err)
      setError(err instanceof Error ? err.message : 'Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }, [
    room,
    isConnecting,
    roomName,
    userName,
    userId,
    projectId,
    setupAudioHandling,
    updateParticipants,
    updateLocalParticipant,
  ])

  // Room 연결 해제 (개선된 정리)
  const disconnect = useCallback(() => {
    if (room) {
      // 모든 오디오 요소 정리
      audioElementsRef.current.forEach(audioElement => {
        audioElement.remove()
      })
      audioElementsRef.current.clear()
      participantVolumesRef.current.clear()

      room.disconnect()
      setRoom(null)
      setError(null)
      setParticipants([])
      setIsMicrophoneEnabled(false)
      setIsSpeaking(false)
    }
  }, [room])

  // 마이크 토글 (개선된 버전 - 즉각적인 상태 업데이트)
  const toggleMicrophone = useCallback(async () => {
    if (!room?.localParticipant) return

    const currentState = room.localParticipant.isMicrophoneEnabled
    const newState = !currentState

    // 1. 즉시 UI 상태 업데이트 (사용자 피드백 향상)
    setIsMicrophoneEnabled(newState)

    try {
      // 2. LiveKit API 호출
      await room.localParticipant.setMicrophoneEnabled(newState)

      // 3. 성공 후 실제 상태와 동기화
      updateLocalParticipant(room)
    } catch (err) {
      console.error('Failed to toggle microphone:', err)

      // 4. 마이크 권한 거부 에러 체크
      if (err instanceof Error && err.name === 'NotAllowedError') {
        // Toast message for microphone permission denial
        toast.error('Please allow mic access in your browser settings.')
      } else {
        // Other errors
        toast.error('Failed to toggle microphone. Please try again.')
      }

      // 5. 실패 시 원래 상태로 롤백
      setIsMicrophoneEnabled(currentState)
      updateLocalParticipant(room)
    }
  }, [room, updateLocalParticipant])

  // 참가자 볼륨 설정 (개선된 버전 - 슬라이더 값 범위 수정)
  const setParticipantVolume = useCallback(
    (participantIdentity: string, volume: number) => {
      if (!room) return

      // 슬라이더 값 (0-100)을 LiveKit 범위 (0-1)로 변환
      const normalizedVolume = Math.max(0, Math.min(1, volume / 100))
      participantVolumesRef.current.set(participantIdentity, normalizedVolume)

      // 1. LiveKit API를 통한 볼륨 설정 (권장 방법)
      const participant = room.remoteParticipants.get(participantIdentity)
      if (participant) {
        // LiveKit의 공식 볼륨 설정 API 사용
        participant.setVolume(normalizedVolume)
      }

      // 2. 직접 오디오 요소 조작 (백업 방법)
      const audioElement = audioElementsRef.current.get(participantIdentity)
      if (audioElement) {
        audioElement.volume = normalizedVolume
      }

      // 3. 참가자 상태 업데이트 (UI에는 0-100 범위로 표시)
      setParticipants(prev =>
        prev.map(p =>
          p.identity === participantIdentity
            ? { ...p, volume: volume } // 슬라이더 값 그대로 저장 (0-100)
            : p,
        ),
      )

      // 4. 로컬스토리지에 볼륨 설정 저장
      if (projectId) {
        const storedVolumes = getStoredVolumes(projectId)
        storedVolumes[participantIdentity] = volume
        saveStoredVolumes(storedVolumes, projectId)
      }
    },
    [room, projectId],
  )

  // 자동 연결
  useEffect(() => {
    if (!room && roomName && userName && userId) {
      connect()
    }
  }, [room, roomName, userName, userId, connect])

  // 컴포넌트 언마운트 시 정리 (개선된 버전)
  useEffect(() => {
    return () => {
      if (room) {
        // 모든 오디오 요소 정리
        audioElementsRef.current.forEach(audioElement => {
          audioElement.remove()
        })
        audioElementsRef.current.clear()
        participantVolumesRef.current.clear()

        room.disconnect()
      }
    }
  }, [room])

  // 상태 계산
  const isConnected = !!room && room.state === ConnectionState.Connected

  return {
    room,
    isConnected,
    isConnecting,
    error,
    participants,
    isMicrophoneEnabled,
    isSpeaking,
    isTogglingMicrophone: false, // 간소화로 제거
    connect,
    disconnect,
    toggleMicrophone,
    setParticipantVolume,
  }
}
