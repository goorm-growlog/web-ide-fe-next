'use client'

import { HocuspocusProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'
import type { UserInfo } from '@/shared/types/user'

// 탭 기반 연결 엔트리
interface TabConnection {
  provider: HocuspocusProvider
  yDoc: Y.Doc
  lastAccess: number
}

// 5개 탭 제한 단순 WebSocket 풀 관리
class SimpleTabWebSocketPool {
  private readonly MAX_TABS = 5

  // 열린 탭 연결: fileId -> connection info
  private tabConnections = new Map<string, TabConnection>()

  // LRU 순서 추적
  private accessOrder: string[] = []

  private wsUrl =
    process.env.NEXT_PUBLIC_YJS_WEBSOCKET_URL || 'ws://localhost:3001'

  /**
   * LRU 순서 업데이트
   */
  private updateAccessOrder(fileId: string): void {
    // 기존 위치에서 제거
    const index = this.accessOrder.indexOf(fileId)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
    // 맨 끝에 추가 (가장 최근 사용)
    this.accessOrder.push(fileId)
  }

  /**
   * 가장 오래된 탭 제거
   */
  private evictOldestTab(): void {
    if (this.accessOrder.length === 0) return

    const oldestFileId = this.accessOrder.shift()
    if (!oldestFileId) return

    const connection = this.tabConnections.get(oldestFileId)

    if (connection) {
      connection.provider.disconnect()
      connection.provider.destroy()
      connection.yDoc.destroy()
      this.tabConnections.delete(oldestFileId)
    }
  }

  /**
   * 랜덤 색상 생성
   */
  private generateRandomColor(): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FCEA2B',
      '#FF9FF3',
      '#54A0FF',
      '#5F27CD',
    ]
    return colors[Math.floor(Math.random() * colors.length)] || '#FF6B6B'
  }

  /**
   * 파일별 연결 및 문서 획득 (탭 기반)
   */
  getFileDocument(
    projectId: string,
    fileId: string,
    userInfo: UserInfo,
    onSynced?: (yDoc: Y.Doc) => void,
  ): {
    yDoc: Y.Doc
    yProvider: HocuspocusProvider
  } {
    // 기존 연결 확인
    let connection = this.tabConnections.get(fileId)

    if (connection) {
      // 탭 히트: 접근 시간 및 순서 업데이트
      connection.lastAccess = Date.now()
      this.updateAccessOrder(fileId)
      return {
        yDoc: connection.yDoc,
        yProvider: connection.provider,
      }
    }

    // 탭 미스: 새 연결 생성

    // 최대 탭 수 초과 시 가장 오래된 탭 제거
    if (this.tabConnections.size >= this.MAX_TABS) {
      this.evictOldestTab()
    }

    // 새 Y.Doc 및 Provider 생성
    const fileDoc = new Y.Doc({ guid: fileId })
    const roomName = `project-${projectId}-${fileId}`

    // WebSocket 연결 생성
    const provider = new HocuspocusProvider({
      url: this.wsUrl,
      name: roomName,
      document: fileDoc,
    })

    provider.on('synced', () => {
      // 동기화 후 Y.Doc 내용 확인 및 콜백 호출
      setTimeout(() => {
        // onSynced 콜백 호출 (Monaco 모델 업데이트용)
        if (onSynced) {
          onSynced(fileDoc)
        }
      }, 100)
    })

    // 사용자 정보 설정 (race condition 방지를 위해 activeFile도 함께 설정)
    if (provider.awareness) {
      provider.awareness.setLocalStateField('user', {
        name: userInfo.name,
        color: userInfo.color || this.generateRandomColor(),
        email: userInfo.email,
      })
      // ✅ fileId를 사용해 activeFile 상태를 즉시 설정 (경쟁 상태 방지)
      provider.awareness.setLocalStateField('activeFile', fileId)
    }

    // 탭 연결 맵에 추가
    connection = {
      provider,
      yDoc: fileDoc,
      lastAccess: Date.now(),
    }

    this.tabConnections.set(fileId, connection)
    this.updateAccessOrder(fileId)

    return {
      yDoc: fileDoc,
      yProvider: provider,
    }
  }

  /**
   * 탭을 닫을 때 연결만 끊고, 나중에 재사용할 수 있도록 세션은 유지합니다.
   */
  closeFileDocument(fileId: string): void {
    const connection = this.tabConnections.get(fileId)

    if (connection) {
      // Provider 연결만 해제하고, provider와 yDoc 인스턴스는 메모리에 유지합니다.
      // 이렇게 하면 나중에 파일을 다시 열 때 기존 Y.doc을 재사용하여 내용을 복구할 수 있습니다.
      connection.provider.disconnect()

      // 아래 두 줄을 주석 처리하여 provider와 yDoc 인스턴스를 유지합니다.
      // connection.provider.destroy();
      // this.tabConnections.delete(fileId);

      // 접근 순서에서는 제거하여 LRU 관리는 유지합니다.
      const index = this.accessOrder.indexOf(fileId)
      if (index > -1) {
        this.accessOrder.splice(index, 1)
      }
    }
  }

  /**
   * 프로젝트 전환 시 모든 연결 정리
   */
  closeAllConnections(): void {
    for (const connection of this.tabConnections.values()) {
      connection.provider.disconnect()
      connection.provider.destroy()
      connection.yDoc.destroy()
    }

    this.tabConnections.clear()
    this.accessOrder = []
  }

  /**
   * 첫 번째 파일 문서 정보 (디버깅용)
   */
  getFirstFileDocumentInfo():
    | {
        docGuid: string
        textLength: number
        clientId: number
      }
    | undefined {
    const firstEntry = this.tabConnections.values().next().value as
      | TabConnection
      | undefined
    if (!firstEntry) return undefined

    return {
      docGuid: firstEntry.yDoc.guid,
      textLength: firstEntry.yDoc.getText('monaco').length,
      clientId: firstEntry.yDoc.clientID,
    }
  }

  /**
   * 탭 연결 상태 (디버깅용)
   */
  getTabConnectionStatus(): {
    totalConnections: number
    openTabs: Array<{
      fileId: string
      lastAccess: number
      connected: boolean
    }>
    accessOrder: string[]
    maxTabs: number
  } {
    const openTabs = [...this.tabConnections.entries()].map(
      ([fileId, connection]) => ({
        fileId,
        lastAccess: connection.lastAccess,
        connected: Boolean(
          (
            connection.provider as HocuspocusProvider & {
              wsconnected?: boolean
            }
          ).wsconnected,
        ),
      }),
    )

    return {
      totalConnections: this.tabConnections.size,
      openTabs,
      accessOrder: [...this.accessOrder],
      maxTabs: this.MAX_TABS,
    }
  }
}

// 싱글톤 인스턴스
export const websocketPool = new SimpleTabWebSocketPool()
