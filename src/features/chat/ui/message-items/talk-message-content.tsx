import { getPartText } from '@/features/chat/lib/code-link-utils'
import type { MessagePart } from '@/features/chat/model/message-types'
import { CodeLink } from '@/features/chat/ui/shared/code-link'
import { MessageTime } from '@/features/chat/ui/shared/message-time'
import { cn } from '@/shared/lib/utils'

interface TalkMessageContentProps {
  parts: MessagePart[]
  content: string
  sentAt: string
  isOwnMessage?: boolean
  className?: string
}

const TalkMessageContent = ({
  parts,
  content,
  sentAt,
  isOwnMessage = false,
}: TalkMessageContentProps) => {
  return (
    <div className={cn('flex items-end gap-2')}>
      {isOwnMessage && <MessageTime sentAt={sentAt} className={'text-left'} />}
      <section
        className={cn(
          'inline-block',
          'rounded-2xl px-4 py-3 shadow-sm',
          isOwnMessage
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm bg-muted text-muted-foreground',
        )}
      >
        {parts.map((part, index) => {
          const key = `${content}-${index}-${sentAt}`

          if (part.codeLink)
            return (
              <CodeLink
                key={key}
                text={getPartText(part)}
                url={part.codeLink.url}
                className="break-keep"
              />
            )

          return (
            <span key={key} className="break-keep">
              {getPartText(part)}
            </span>
          )
        })}
      </section>

      {!isOwnMessage && (
        <MessageTime sentAt={sentAt} className={'text-right'} />
      )}
    </div>
  )
}

export default TalkMessageContent
export { TalkMessageContent }
