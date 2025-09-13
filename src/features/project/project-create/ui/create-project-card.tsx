'use client'

import { Grid2x2Plus } from 'lucide-react'
import { Card } from '@/shared/ui/shadcn/card'

interface CreateProjectCardProps {
  onClick?: () => void
  height?: string
}

export function CreateProjectCard({
  onClick,
  height = '150px',
}: CreateProjectCardProps) {
  return (
    <Card
      className="group flex w-full cursor-pointer items-center justify-center border-border/80 bg-background shadow-none transition-colors hover:bg-muted/50 hover:shadow-sm"
      style={{ height }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2.5">
        <Grid2x2Plus className="h-6 w-6 text-muted-foreground group-hover:text-foreground/80" />
        <p className="font-semibold text-muted-foreground text-sm group-hover:text-foreground/80">
          Create New Project
        </p>
      </div>
    </Card>
  )
}
