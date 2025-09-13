import type { ReactNode } from 'react'
import { getSystemMessageText } from '@/features/chat/lib/message-helpers'
import type { SystemMessage } from '@/features/chat/types/message-types'
import { formatDate } from '@/shared/lib/date-utils'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/shadcn'

const SystemMessageLayout = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => (
  <div className={cn('my-8 flex justify-center', className)}>{children}</div>
)

const SystemMessageItem = ({ message }: { message: SystemMessage }) => (
  <SystemMessageLayout>
    <Badge
      variant="secondary"
      className="px-2 py-1 text-muted-foreground text-xs"
    >
      {getSystemMessageText(message)}
    </Badge>
  </SystemMessageLayout>
)

export const DateHeader = ({ date }: { date: string }) => {
  return (
    <SystemMessageLayout>
      <div className="text-center font-medium text-muted-foreground text-xs">
        {formatDate(date)}
      </div>
    </SystemMessageLayout>
  )
}

export default SystemMessageItem
export { SystemMessageItem }
