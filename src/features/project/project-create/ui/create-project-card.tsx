'use client'

import { Grid2x2Plus } from 'lucide-react'
import { Card } from '@/shared/ui/shadcn/card'

interface CreateProjectCardProps {
  onClick?: () => void
  height?: string
}

export function CreateProjectCard({ onClick, height }: CreateProjectCardProps) {
  const cardHeightClass = height ? `h-[${height}]` : 'h-[150px]'

  return (
    <Card
      className={`group flex w-full cursor-pointer items-center justify-center border-border/40 bg-background transition-colors hover:bg-muted/50 ${cardHeightClass}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2.5">
        <Grid2x2Plus className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
        <p className="font-semibold text-foreground/80 text-sm">
          Create New Project
        </p>
      </div>
    </Card>
  )
}
