import { NextRequest } from 'next/server'
import { Liveblocks } from '@liveblocks/node'
import { auth } from '@/shared/config/auth'

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY ?? '',
})

export const POST = async (request: NextRequest) => {
  const { room } = await request.json()
  const session = await auth()

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!process.env.LIVEBLOCKS_SECRET_KEY) {
    return new Response('Server configuration error', { status: 500 })
  }

  const userInfo = {
    name: session.user.name ?? session.user.email ?? 'Anonymous',
    avatar: session.user.image ?? '',
    color: '#6366f1', // 기본 색상
    picture: session.user.image ?? '',
  }

  const sessionToken = liveblocks.prepareSession(session.user.id, {
    userInfo,
  })

  sessionToken.allow(room, sessionToken.FULL_ACCESS)
  const { status, body } = await sessionToken.authorize()
  return new Response(body, { status })
}
