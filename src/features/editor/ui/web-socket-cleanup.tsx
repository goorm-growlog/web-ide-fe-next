'use client'

import { useEffect } from 'react'
import { websocketPool } from '../model/websocket-pool'

/**
 * 애플리케이션 종료시 WebSocket 연결 정리 컴포넌트
 * beforeunload 이벤트에서 모든 연결을 안전하게 정리합니다.
 */
export const WebSocketCleanup = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // 브라우저 종료/새로고침 시 모든 WebSocket 연결 정리
      websocketPool.closeAllConnections()
    }

    // 페이지 이탈 시 정리
    const handleUnload = () => {
      websocketPool.closeAllConnections()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    // 컴포넌트 언마운트 시에도 정리
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
      websocketPool.closeAllConnections()
    }
  }, [])

  return null // UI를 렌더링하지 않는 유틸리티 컴포넌트
}
