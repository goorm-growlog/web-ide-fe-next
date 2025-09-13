import { create } from 'zustand'
import { createConnectionManager } from '@/entities/websocket/stores/connection-manager'
import { createSubscriptionManager } from '@/entities/websocket/stores/subscription-manager'
import type {
  ConnectionManager,
  SubscriptionManager,
} from '@/entities/websocket/types/websocket-types'

export const useWebSocketClient = create<
  ConnectionManager & SubscriptionManager
>()((...args) => ({
  ...createConnectionManager(...args),
  ...createSubscriptionManager(...args),
}))
