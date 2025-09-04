'use client'

import { Users } from 'lucide-react'

export function EmptyInvitedState() {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border border-border border-dashed">
      <div className="flex flex-col items-center gap-2 text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          You have not been invited to any projects yet.
        </p>
      </div>
    </div>
  )
}
