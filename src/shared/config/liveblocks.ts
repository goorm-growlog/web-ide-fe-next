import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

const client = createClient({
  authEndpoint: '/api/liveblocks/auth',
})

export const {
  RoomProvider,
  useMyPresence,
  useOthers,
  useUpdateMyPresence,
  useMutation,
  useStorage,
  useRoom,
} = createRoomContext(client)
