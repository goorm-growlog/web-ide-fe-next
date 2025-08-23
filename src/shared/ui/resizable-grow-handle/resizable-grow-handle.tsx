import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/utils'
import { ResizableHandle } from '../shadcn/resizable'

interface ResizableGrowHandleProps
  extends ComponentProps<typeof ResizableHandle> {
  orientation?: 'horizontal' | 'vertical'
}

const ResizableGrowHandle = ({
  className,
  orientation = 'horizontal',
  'aria-label': ariaLabel,
  ...props
}: ResizableGrowHandleProps) => {
  const defaultAriaLabel =
    orientation === 'horizontal' ? 'Resize column' : 'Resize row'

  return (
    <ResizableHandle
      className={cn(
        'cursor-col-resize bg-border transition-all duration-200 ease-out hover:w-1.5',
        className,
      )}
      aria-label={ariaLabel || defaultAriaLabel}
      {...props}
    />
  )
}

export default ResizableGrowHandle
