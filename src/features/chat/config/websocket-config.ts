/**
 * WebSocket Configuration for Chat
 * WebSocket connection and STOMP destination settings
 */
export const CHAT_WEBSOCKET_CONFIG = {
  WS_URL: process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/ws`
    : 'https://growlog-web-ide.duckdns.org/ws',

  // STOMP Destinations
  DESTINATIONS: {
    SUBSCRIBE: (projectId: string) => `/topic/projects/${projectId}/chat`,
    PUBLISH_TALK: (projectId: string) => `/app/projects/${projectId}/chat/talk`,
  },
} as const
