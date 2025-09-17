import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../route'

// 모킹
vi.mock('@liveblocks/node', () => ({
  Liveblocks: vi.fn().mockImplementation(() => ({
    prepareSession: vi.fn().mockReturnValue({
      allow: vi.fn(),
      authorize: vi.fn().mockResolvedValue({
        status: 200,
        body: 'mock-token',
      }),
    }),
  })),
}))

vi.mock('@/shared/config/auth', () => ({
  auth: vi.fn(),
}))

describe('Liveblocks Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 환경 변수 설정
    process.env.LIVEBLOCKS_SECRET_KEY = 'sk_test_mock_key'
  })

  it('should return 401 when user is not authenticated', async () => {
    // Given: 인증되지 않은 사용자
    const { auth } = await import('@/shared/config/auth')
    vi.mocked(auth).mockResolvedValue(null as unknown as ReturnType<typeof auth>)

    const request = new NextRequest('http://localhost:3000/api/liveblocks/auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
      headers: { 'Content-Type': 'application/json' },
    })

    // When: 인증 API를 호출할 때
    const response = await POST(request)

    // Then: 401 에러를 반환해야 함
    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  it('should return 500 when LIVEBLOCKS_SECRET_KEY is not set', async () => {
    // Given: 환경 변수가 설정되지 않은 경우
    delete process.env.LIVEBLOCKS_SECRET_KEY
    const { auth } = await import('@/shared/config/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-123', name: 'Test User', email: 'test@example.com' },
    } as unknown as ReturnType<typeof auth>)

    const request = new NextRequest('http://localhost:3000/api/liveblocks/auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
      headers: { 'Content-Type': 'application/json' },
    })

    // When: 인증 API를 호출할 때
    const response = await POST(request)

    // Then: 500 에러를 반환해야 함
    expect(response.status).toBe(500)
    expect(await response.text()).toBe('Server configuration error')
  })

  it('should return 200 with token when user is authenticated', async () => {
    // Given: 인증된 사용자
    const { auth } = await import('@/shared/config/auth')
    vi.mocked(auth).mockResolvedValue({
      user: {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg'
      },
    } as unknown as ReturnType<typeof auth>)

    const request = new NextRequest('http://localhost:3000/api/liveblocks/auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
      headers: { 'Content-Type': 'application/json' },
    })

    // When: 인증 API를 호출할 때
    const response = await POST(request)

    // Then: 200 응답과 토큰을 반환해야 함
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('mock-token')
  })

  it('should handle user without name or email', async () => {
    // Given: 이름과 이메일이 없는 사용자
    const { auth } = await import('@/shared/config/auth')
    vi.mocked(auth).mockResolvedValue({
      user: {
        id: 'user-123',
        name: null,
        email: null,
        image: null
      },
    } as unknown as ReturnType<typeof auth>)

    const request = new NextRequest('http://localhost:3000/api/liveblocks/auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
      headers: { 'Content-Type': 'application/json' },
    })

    // When: 인증 API를 호출할 때
    const response = await POST(request)

    // Then: 200 응답을 반환해야 함 (빈 사용자 정보로도 처리 가능)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('mock-token')
  })
})
