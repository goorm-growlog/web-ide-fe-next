import { memo } from 'react'
import { formatDate, formatTime } from '@/shared/lib/date-utils'
import { cn } from '@/shared/lib/utils'

interface MessageTimeProps {
  sentAt: string
  className?: string
}

const MessageTime = memo(({ sentAt, className }: MessageTimeProps) => {
  return (
    <time
      className={cn(
        'flex-shrink-0',
        'text-muted-foreground text-xs',
        'transition-opacity hover:opacity-80',
        className,
      )}
      dateTime={sentAt}
      title={`Sent at ${formatDate(sentAt)}`}
    >
      {formatTime(sentAt)}
    </time>
  )
})

export default MessageTime
export { MessageTime }
