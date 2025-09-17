'use client'

import { memo } from 'react'
import type { ChatMessage } from '@/entities/chat/model/types'
import { cn } from '@/shared/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'

interface MessageItemProps {
  message: ChatMessage
  isCurrentUser: boolean
  showAvatar?: boolean
  className?: string
}

export const MessageItem = memo(
  ({
    message,
    isCurrentUser,
    showAvatar = true,
    className,
  }: MessageItemProps) => {
    const formatTime = (timestamp: string) => {
      return new Date(timestamp).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    return (
      <div
        className={cn(
          'flex gap-3 p-3 transition-colors hover:bg-muted/50',
          isCurrentUser ? 'flex-row-reverse' : 'flex-row',
          className,
        )}
      >
        {/* 아바타 */}
        {showAvatar && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage
              src={message.sender.avatar}
              alt={message.sender.name}
            />
            <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
          </Avatar>
        )}

        {/* 메시지 내용 */}
        <div
          className={cn(
            'flex max-w-[70%] flex-col gap-1',
            isCurrentUser ? 'items-end' : 'items-start',
          )}
        >
          {/* 발신자 이름 */}
          {!isCurrentUser && (
            <span className="font-medium text-muted-foreground text-xs">
              {message.sender.name}
            </span>
          )}

          {/* 메시지 버블 */}
          <div
            className={cn(
              'rounded-lg px-3 py-2 text-sm',
              isCurrentUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground',
            )}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>

            {/* 수정 표시 */}
            {message.isEdited && (
              <span className="ml-1 text-xs opacity-70">(수정됨)</span>
            )}
          </div>

          {/* 타임스탬프 */}
          <span className="text-muted-foreground text-xs">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    )
  },
)
