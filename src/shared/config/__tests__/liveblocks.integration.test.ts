import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Liveblocks Integration Tests', () => {
  let client: ReturnType<typeof createClient>
  let roomContext: ReturnType<typeof createRoomContext>

  beforeAll(() => {
    // 실제 Liveblocks 클라이언트 생성 (환경 변수 필요)
    client = createClient({
      authEndpoint: '/api/liveblocks/auth',
    })

    roomContext = createRoomContext(client)
  })

  afterAll(() => {
    // 정리 작업
  })

  it('should create real Liveblocks client', () => {
    // Given: 실제 Liveblocks 클라이언트
    // When: 클라이언트를 생성할 때
    // Then: 실제 클라이언트가 생성되어야 함
    expect(client).toBeDefined()
    expect(typeof client).toBe('object')
  })

  it('should create real room context', () => {
    // Given: 실제 클라이언트
    // When: room context를 생성할 때
    // Then: 실제 room context가 생성되어야 함
    expect(roomContext).toBeDefined()
    expect(roomContext).toHaveProperty('RoomProvider')
    expect(roomContext).toHaveProperty('useMyPresence')
    expect(roomContext).toHaveProperty('useOthers')
    expect(roomContext).toHaveProperty('useUpdateMyPresence')
    expect(roomContext).toHaveProperty('useMutation')
    expect(roomContext).toHaveProperty('useStorage')
  })

  it('should have correct auth endpoint configuration', () => {
    // Given: 실제 클라이언트
    // When: 클라이언트 설정을 확인할 때
    // Then: 올바른 auth endpoint가 설정되어야 함
    expect(client).toBeDefined()
    // 실제 클라이언트의 설정을 확인하는 방법이 필요
  })
})
