import { create } from 'zustand'
import type {
  ConnectionManager,
  SubscriptionManager,
} from '@/entities/websocket/types/websocket-types'
import { createConnectionManager } from './connection-manager'
import { createSubscriptionManager } from './subscription-manager'

// 🎯 통합 WebSocket 클라이언트
export const useWebSocketClient = create<
  ConnectionManager & SubscriptionManager
>()((...args) => ({
  ...createConnectionManager(...args),
  ...createSubscriptionManager(...args),
}))
