import { cn } from '@/shared/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-md bg-accent',
        // Add style - Enhanced animation for better visibility
        'transition-all duration-300 ease-in-out',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
