'use client'

import type { LucideIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'

interface IconButtonProps
  extends Omit<ComponentProps<typeof Button>, 'children'> {
  Icon: LucideIcon
  isSelected?: boolean
  variant?: ComponentProps<typeof Button>['variant']
  size?: ComponentProps<typeof Button>['size']
}

const IconButton = ({
  Icon,
  isSelected = false,
  className,
  variant = 'outline',
  size = 'icon',
  ...props
}: IconButtonProps) => {
  return (
    <Button
      className={cn(className, {
        'bg-accent text-accent-foreground dark:bg-input/50': isSelected,
      })}
      variant={variant}
      size={size}
      {...props}
    >
      <Icon />
    </Button>
  )
}

export default IconButton
export { IconButton }
