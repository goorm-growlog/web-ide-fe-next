import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'
import { describe, expect, it } from 'vitest'

describe('Liveblocks Client Configuration', () => {
  it('should create client with correct auth endpoint', () => {
    // Given: 올바른 auth endpoint
    const expectedAuthEndpoint = '/api/liveblocks/auth'

    // When: 클라이언트를 생성할 때
    const client = createClient({
      authEndpoint: expectedAuthEndpoint,
    })

    // Then: 클라이언트가 생성되어야 함
    expect(client).toBeDefined()
    expect(typeof client).toBe('object')
  })

  it('should create room context with client', () => {
    // Given: 클라이언트가 있을 때
    const client = createClient({
      authEndpoint: '/api/liveblocks/auth',
    })

    // When: room context를 생성할 때
    const roomContext = createRoomContext(client)

    // Then: 올바른 room context가 생성되어야 함
    expect(roomContext).toBeDefined()
    expect(roomContext).toHaveProperty('RoomProvider')
    expect(roomContext).toHaveProperty('useMyPresence')
    expect(roomContext).toHaveProperty('useOthers')
    expect(roomContext).toHaveProperty('useUpdateMyPresence')
    expect(roomContext).toHaveProperty('useMutation')
    expect(roomContext).toHaveProperty('useStorage')
  })
})
