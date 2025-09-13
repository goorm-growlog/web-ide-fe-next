'use client'

import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-skeleton'
import { Button } from '@/shared/ui/shadcn/button'

// 연결 상태 타입
export type ConnectionStatusType =
  | 'initializing'
  | 'connecting'
  | 'connected'
  | 'error'

// 에러 타입
export type ConnectionErrorType = 'websocket' | 'stomp' | 'timeout' | 'unknown'

// 기본 연결 상태 Props
interface BaseConnectionProps {
  status: ConnectionStatusType
}

// 에러 상태 Props (에러 상태일 때만 필요한 필수 props)
interface ErrorConnectionProps extends BaseConnectionProps {
  status: 'error'
  error: string
  onRetry: () => void
  isRetrying: boolean
}

// 다른 상태 Props (에러가 아닌 상태)
interface OtherConnectionProps extends BaseConnectionProps {
  status: 'initializing' | 'connecting' | 'connected'
}

// 통합 Props 타입
export type ConnectionStatusProps = ErrorConnectionProps | OtherConnectionProps

/**
 * WebSocket 연결 상태 통합 컴포넌트
 */
export const ConnectionStatus = (props: ConnectionStatusProps) => {
  const { status } = props
  const getErrorMessage = (error: string): string => {
    if (error.includes('WebSocket')) return 'WebSocket connection failed'
    if (error.includes('STOMP')) return 'STOMP protocol error'
    if (error.includes('timeout')) return 'Connection timeout'
    return error
  }

  const getErrorIcon = (error: string) => {
    if (error.includes('WebSocket') || error.includes('network')) {
      return <WifiOff className="h-8 w-8 text-destructive" />
    }
    return <AlertCircle className="h-8 w-8 text-destructive" />
  }

  switch (status) {
    case 'initializing':
      return (
        <div className="space-y-2 text-center text-muted-foreground">
          <h3 className="font-medium text-lg">Initializing...</h3>
          <p className="text-sm">Preparing connection</p>
        </div>
      )

    case 'connecting':
      return (
        <div className="space-y-4 text-center text-muted-foreground">
          <div className="flex justify-center">
            <LoadingSpinner size="md" />
          </div>
          <h3 className="font-medium text-lg">Connecting to server...</h3>
          <p className="text-sm">Establishing WebSocket connection</p>
        </div>
      )

    case 'connected':
      return (
        <div className="space-y-2 text-center text-muted-foreground">
          <h3 className="font-medium text-lg">Project Ready</h3>
          <p className="text-sm">WebSocket connected successfully</p>
        </div>
      )

    case 'error': {
      const errorProps = props as ErrorConnectionProps
      const { error, onRetry, isRetrying } = errorProps

      return (
        <div className="space-y-4 text-center">
          {/* 에러 아이콘 */}
          <div className="flex justify-center">{getErrorIcon(error)}</div>

          {/* 에러 제목 */}
          <h3 className="font-medium text-destructive text-lg">
            Connection Failed
          </h3>

          {/* 에러 메시지 */}
          <p className="text-muted-foreground text-sm">
            {getErrorMessage(error)}
          </p>

          {/* 현재 시간 표시 */}
          <p className="text-muted-foreground text-xs">
            Error occurred at {new Date().toLocaleTimeString()}
          </p>

          {/* 재시도 버튼 */}
          <Button onClick={onRetry} disabled={isRetrying} size="sm">
            {isRetrying ? (
              <>
                <LoadingSpinner size="sm" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Retry Connection
              </>
            )}
          </Button>
        </div>
      )
    }

    default:
      return null
  }
}
