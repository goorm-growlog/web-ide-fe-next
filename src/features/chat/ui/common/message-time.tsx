import { memo } from 'react'
import { formatDate, formatTime } from '@/shared/lib/date-utils'
import { cn } from '@/shared/lib/utils'

interface MessageTimeProps {
  sentAt: Date
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
      dateTime={sentAt.toISOString()}
      title={`Sent at ${formatDate(sentAt.toISOString())}`}
    >
      {formatTime(sentAt.toISOString())}
    </time>
  )
})

export default MessageTime
export { MessageTime }
