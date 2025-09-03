'use client'

import { Button } from '@/shared/ui/shadcn/button'

interface ProjectSectionHeaderProps {
  title: string
  totalCount: number
  onViewAll?: () => void
}

export function ProjectSectionHeader({
  title,
  totalCount,
  onViewAll,
}: ProjectSectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="font-semibold text-foreground/80 text-sm leading-5">
        {title}
      </h2>
      {totalCount > 0 && (
        <Button
          variant="ghost"
          className="h-auto p-0 font-medium text-muted-foreground text-xs hover:text-foreground"
          onClick={onViewAll}
        >
          view all({totalCount})
        </Button>
      )}
    </div>
  )
}
