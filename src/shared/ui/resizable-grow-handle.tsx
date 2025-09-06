import type { ComponentProps } from 'react'
import { ResizableHandle } from 'src/shared/ui/shadcn/resizable'
import { cn } from '@/shared/lib/utils'

interface ResizableGrowHandleProps
  extends ComponentProps<typeof ResizableHandle> {
  orientation?: 'horizontal' | 'vertical'
}

const ResizableGrowHandle = ({
  className,
  orientation = 'horizontal',
  ...props
}: ResizableGrowHandleProps) => {
  return (
    <ResizableHandle
      className={cn(
        'cursor-col-resize bg-border transition-all duration-200 ease-out hover:w-1.5',
        className,
      )}
      {...props}
    />
  )
}

export default ResizableGrowHandle
export { ResizableGrowHandle }
