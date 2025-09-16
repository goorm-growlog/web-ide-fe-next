import { memo, useMemo } from 'react'
import { DEFAULT_USER_CONFIG } from '@/features/chat/constants/chat-config'
import { parseChatMessage } from '@/features/chat/lib/file-link-parser'
import type { ChatMessage } from '@/features/chat/types/client'
import { OtherUserAvatar } from '@/features/chat/ui/common/other-user-avatar'
import { TalkMessageContent } from '@/features/chat/ui/message-types/talk-message-content'
import { cn } from '@/shared/lib/utils'

interface TalkMessageItemProps {
  message: ChatMessage
  isOwnMessage?: boolean
  isFirstInGroup: boolean
  isLastMessage: boolean
  showAvatar?: boolean
  showUsername?: boolean
}

/**
 * @todo 사용자 정보를 전역 스토어에서 가져오기
 * @todo 프로필 이미지, 사용자명 등을 실제 데이터로 교체
 */
const TalkMessageItem = memo(
  ({
    message,
    isOwnMessage = false,
    isFirstInGroup,
    isLastMessage,
    showAvatar,
    showUsername,
  }: TalkMessageItemProps) => {
    const { username, userImg } = DEFAULT_USER_CONFIG.MOCK_USER_PROFILE
    const { content, timestamp } = message
    const parts = useMemo(() => parseChatMessage(content), [content])

    const shouldShowAvatar = showAvatar ?? (!isOwnMessage && isFirstInGroup)
    const shouldShowUsername = showUsername ?? (!isOwnMessage && isFirstInGroup)

    return (
      <div
        className={cn(
          'flex gap-3 px-4',
          isOwnMessage ? 'justify-end' : 'justify-start',
          // 마지막 메시지가 아닌 경우에만 하단 마진 추가
          !isLastMessage && 'mb-4',
        )}
      >
        {!isOwnMessage ? (
          <>
            {shouldShowAvatar && (
              <OtherUserAvatar userImg={userImg} username={username} />
            )}
            {!shouldShowAvatar && <div className="w-8" />}

            <div
              className={cn('flex max-w-[70%] flex-col gap-2', 'items-start')}
            >
              {shouldShowUsername && (
                <span
                  className={cn(
                    'ml-2',
                    'font-medium text-muted-foreground text-sm',
                  )}
                >
                  {message.user.name || 'Unknown User'}
                </span>
              )}
              <TalkMessageContent
                parts={parts}
                content={content}
                sentAt={timestamp}
                isOwnMessage={isOwnMessage}
              />
            </div>
          </>
        ) : (
          <div className="flex max-w-[70%] flex-col items-end gap-2">
            <TalkMessageContent
              parts={parts}
              content={content}
              sentAt={timestamp}
              isOwnMessage={isOwnMessage}
            />
          </div>
        )}
      </div>
    )
  },
)

export default TalkMessageItem
export { TalkMessageItem }
