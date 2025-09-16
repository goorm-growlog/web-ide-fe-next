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

  // 중복 구독 체크 및 정리 헬퍼 함수
  const handleDuplicateSubscriptions = (
    destination: string,
    handler: messageCallbackType,
    subscriptions: Map<string, SubscriptionInfo>,
  ): string | null => {
    // 중복 구독 방지 (destination과 handler 모두 체크)
    const existing = Array.from(subscriptions.values()).find(
      sub => sub.destination === destination && sub.handler === handler,
    )

    if (existing) {
      errorHandler.debug(`Already subscribed with same handler: ${destination}`)
      return existing.id
    }

    // 같은 destination에 다른 handler가 있는 경우 기존 구독 해제
    const conflictingSub = Array.from(subscriptions.values()).find(
      sub => sub.destination === destination && sub.handler !== handler,
    )

    if (conflictingSub) {
      errorHandler.debug(`Replacing existing subscription for: ${destination}`)
      try {
        conflictingSub.subscription.unsubscribe()
        const newSubscriptions = new Map(subscriptions)
        newSubscriptions.delete(conflictingSub.id)
        set({ subscriptions: newSubscriptions })
      } catch (error) {
        errorHandler.handleUnsubscribeError(conflictingSub.id, error)
      }
    }

    return null
  }

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

      // 중복 구독 처리
      const existingId = handleDuplicateSubscriptions(
        destination,
        handler,
        subscriptions,
      )
      if (existingId) {
        return existingId
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
