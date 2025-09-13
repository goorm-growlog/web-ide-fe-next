import type { messageCallbackType } from '@stomp/stompjs'
import type { StateCreator } from 'zustand'
import { LOG_PREFIX } from '@/entities/websocket/config/websocket-config'
import { createErrorHandler } from '@/entities/websocket/lib/error-handler'
import type {
  ConnectionManager,
  SubscriptionInfo,
  SubscriptionManager,
} from '@/entities/websocket/types/websocket-types'

export const createSubscriptionManager: StateCreator<
  SubscriptionManager & ConnectionManager,
  [],
  [],
  SubscriptionManager
> = (set, get) => {
  const errorHandler = createErrorHandler(LOG_PREFIX.SUBSCRIPTION)

  return {
    // 초기 상태
    subscriptions: new Map(),

    // 🎯 구독
    subscribe: (
      destination: string,
      handler: messageCallbackType,
    ): string | null => {
      const { client, subscriptions, isConnected } = get()

      // 🔍 구독 안전성 검증
      if (!client?.connected || !isConnected) {
        errorHandler.warn('Cannot subscribe: not connected')
        return null
      }

      if (!destination || !handler) {
        errorHandler.handleInvalidParams({
          destination: !!destination,
          handler: !!handler,
        })
        return null
      }

      // 중복 구독 방지
      const existing = Array.from(subscriptions.values()).find(
        sub => sub.destination === destination,
      )

      if (existing) {
        errorHandler.debug(`Already subscribed: ${destination}`)
        return existing.id
      }

      // 🎯 단순 구독
      try {
        const subscription = client.subscribe(destination, handler)

        if (subscription) {
          const subscriptionId = crypto.randomUUID()
          const subscriptionInfo: SubscriptionInfo = {
            id: subscriptionId,
            destination,
            subscription,
            handler,
          }

          const newSubscriptions = new Map(subscriptions)
          newSubscriptions.set(subscriptionId, subscriptionInfo)
          set({ subscriptions: newSubscriptions })

          return subscriptionId
        }

        errorHandler.handleSubscriptionError(
          destination,
          new Error('Subscription returned null'),
        )
        return null
      } catch (error) {
        errorHandler.handleSubscriptionError(destination, error)
        return null
      }
    },

    // 구독 해제
    unsubscribe: (subscriptionId: string) => {
      if (!subscriptionId) {
        errorHandler.warn('Invalid subscription ID')
        return
      }

      const { subscriptions } = get()
      const subscription = subscriptions.get(subscriptionId)

      if (!subscription) {
        errorHandler.warn(`Subscription not found: ${subscriptionId}`)
        return
      }

      try {
        subscription.subscription.unsubscribe()
        const newSubscriptions = new Map(subscriptions)
        newSubscriptions.delete(subscriptionId)
        set({ subscriptions: newSubscriptions })
      } catch (error) {
        errorHandler.handleUnsubscribeError(subscriptionId, error)
      }
    },
  }
}
