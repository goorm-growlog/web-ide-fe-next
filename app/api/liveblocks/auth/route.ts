import { NextRequest } from 'next/server'
import { Liveblocks } from '@liveblocks/node'
import { auth } from '@/shared/config/auth'

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY ?? '',
})

export const POST = async (request: NextRequest) => {
  const { room } = await request.json()
  const session = await auth()

  if (!process.env.LIVEBLOCKS_SECRET_KEY) {
    return new Response('Server configuration error', { status: 500 })
  }

  // 로그인하지 않은 사용자를 위한 기본 정보
  const userId = session?.user?.id || `anonymous-${Date.now()}`
  const userInfo = {
    name: session?.user?.name ?? session?.user?.email ?? 'Anonymous User',
    avatar: session?.user?.image ?? '',
    color: '#6366f1', // 기본 색상
    picture: session?.user?.image ?? '',
  }

  const sessionToken = liveblocks.prepareSession(userId, {
    userInfo,
  })

  sessionToken.allow(room, sessionToken.FULL_ACCESS)
  const { status, body } = await sessionToken.authorize()
  return new Response(body, { status })
}
