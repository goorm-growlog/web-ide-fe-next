'use client'

import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'

interface IconButtonProps
  extends Omit<ComponentProps<typeof Button>, 'children'> {
  Icon: LucideIcon
  isSelected?: boolean
}

const IconButton = ({
  Icon,
  isSelected = false,
  className,
  ...props
}: IconButtonProps) => {
  return (
    <Button
      className={cn(
        className,
        isSelected && 'bg-accent text-accent-foreground dark:bg-input/50',
      )}
      variant={'outline'}
      size={'icon'}
      {...props}
    >
      <Icon />
    </Button>
  )
}

export default IconButton
