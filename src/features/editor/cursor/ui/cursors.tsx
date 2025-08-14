'use client'

import type { HocuspocusProvider } from '@hocuspocus/provider'
import { useCallback, useEffect } from 'react'
import type { UserInfo } from '@/shared/types/user'
import './cursors.css'

interface CursorsProps {
  provider: HocuspocusProvider | null
  currentUserId?: string
  activeFileId?: string
}

const CURSOR_STYLES_ID = 'collaborative-cursor-styles'
const isValidColor = (color: string): boolean => /^#[0-9a-fA-F]{6}$/.test(color)

export const Cursors = ({
  provider,
  currentUserId,
  activeFileId,
}: CursorsProps) => {
  // 협업 커서 스타일 생성 및 업데이트
  const renderCursorStyles = useCallback(() => {
    // 기존 스타일 제거 (중복 방지)
    document.getElementById(CURSOR_STYLES_ID)?.remove()

    if (!provider?.awareness) return

    // 현재 접속 중인 모든 사용자의 커서 스타일 생성
    const cursorStyles = [...provider.awareness.getStates()]
      .map(([clientId, clientState]) => {
        // 자신의 커서는 제외
        const user = (clientState as { user?: UserInfo })?.user
        if (user?.email === currentUserId) {
          return ''
        }

        const userActiveFile = (clientState as { activeFile?: string })
          ?.activeFile

        // 같은 파일을 보고 있는 사용자만 처리
        if (userActiveFile !== activeFileId) return ''

        if (!user?.name || !user?.color || !isValidColor(user.color)) {
          return ''
        }

        // 사용자 이름 안전 처리 (특수문자 이스케이프)
        const userName = user.name.slice(0, 20).replace(/['"\\]/g, '\\$&')
        const email = user.email.replace(/['"\\]/g, '\\$&')

        // 사용자별 커서 스타일 정의
        return `
        .yRemoteSelection-${clientId},
        .yRemoteSelectionHead-${clientId} {
          --user-color: ${user.color};
        }
        
        .yRemoteSelectionHead-${clientId}::after {
          content: "${userName}";
        }
        .yRemoteSelectionHead-${clientId}:hover::after {
          content: "${userName} (${email})";
        }`
      })
      .filter(Boolean)
      .join('')

    // 스타일이 있으면 DOM에 추가
    if (cursorStyles) {
      const styleElement = document.createElement('style')
      styleElement.id = CURSOR_STYLES_ID
      styleElement.textContent = cursorStyles
      document.head.appendChild(styleElement)
    }
  }, [provider, currentUserId, activeFileId])

  useEffect(() => {
    if (!provider?.awareness) return

    // awareness 변경 이벤트 등록 (사용자 입/퇴장, 커서 이동 등)
    provider.awareness.on('change', renderCursorStyles)
    // 초기 커서 스타일 렌더링
    renderCursorStyles()

    return () => {
      // 이벤트 리스너 제거 및 스타일 정리
      provider.awareness?.off('change', renderCursorStyles)
      document.getElementById(CURSOR_STYLES_ID)?.remove()
    }
  }, [provider, renderCursorStyles])

  return null
}
