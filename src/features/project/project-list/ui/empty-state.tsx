'use client'

import { Users } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg">
      <div className="flex flex-col items-center gap-2 text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          You have not been invited to any projects yet.
        </p>
      </div>
    </div>
  )
}
