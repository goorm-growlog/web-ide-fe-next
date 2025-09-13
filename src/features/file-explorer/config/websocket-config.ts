/**
 * WebSocket Configuration for File Explorer
 * WebSocket connection and STOMP destination settings
 */
export const WEBSOCKET_CONFIG = {
  WS_URL: process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/ws`
    : 'https://growlog-web-ide.duckdns.org/ws',

  // STOMP Destinations
  DESTINATIONS: {
    SUBSCRIBE: (projectId: string) => `/topic/projects/${projectId}/tree`,
    PUBLISH_INIT: (projectId: string) => `/app/projects/${projectId}/tree/init`,
  },
} as const
