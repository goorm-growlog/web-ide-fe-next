import { memo, useMemo } from 'react'
import { DEFAULT_USER_CONFIG } from '@/features/chat/constants/config'
import { parseChatMessage } from '@/features/chat/lib/code-link-utils'
import type { TalkMessage } from '@/features/chat/model/message-types'
import { OtherUserAvatar } from '@/features/chat/ui/shared/other-user-avatar'
import { cn } from '@/shared/lib/utils'
import { TalkMessageContent } from './talk-message-content'

interface TalkMessageItemProps {
  message: TalkMessage
  isOwnMessage?: boolean
  isFirstInGroup: boolean
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
    showAvatar,
    showUsername,
  }: TalkMessageItemProps) => {
    const { username, userImg } = DEFAULT_USER_CONFIG.MOCK_USER_PROFILE
    const { content, sentAt } = message
    const parts = useMemo(() => parseChatMessage(content), [content])

    const shouldShowAvatar = showAvatar ?? (!isOwnMessage && isFirstInGroup)
    const shouldShowUsername = showUsername ?? (!isOwnMessage && isFirstInGroup)

    return (
      <div
        className={cn(
          'mb-4 flex gap-3 px-4',
          isOwnMessage ? 'justify-end' : 'justify-start',
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
                  {message.username || 'Unknown User'}
                </span>
              )}
              <TalkMessageContent
                parts={parts}
                content={content}
                sentAt={sentAt}
                isOwnMessage={isOwnMessage}
              />
            </div>
          </>
        ) : (
          <div className="flex max-w-[70%] flex-col items-end gap-2">
            <TalkMessageContent
              parts={parts}
              content={content}
              sentAt={sentAt}
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
