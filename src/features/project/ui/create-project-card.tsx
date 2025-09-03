'use client'

import { Grid2x2Plus } from 'lucide-react'
import { Card } from '@/shared/ui/shadcn/card'

interface CreateProjectCardProps {
  onClick?: () => void
}

const CreateProjectCard = ({ onClick }: CreateProjectCardProps) => {
  return (
    <Card
      className="h-[150px] w-[270px] cursor-pointer border-border transition-colors hover:border-ring"
      onClick={onClick}
    >
      <div className="flex h-full flex-col items-center justify-center gap-2 p-3">
        <div className="flex h-6 w-6 items-center justify-center">
          <Grid2x2Plus className="h-6 w-6 text-foreground" />
        </div>
        <p className="text-center font-semibold text-foreground text-sm">
          새 프로젝트 만들기
        </p>
      </div>
    </Card>
  )
}

export default CreateProjectCard
