'use client'

import { Calendar, Heart, MessageCircle } from 'lucide-react'
import { memo } from 'react'
import { cn } from '@/shared/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import { Button } from '@/shared/ui/shadcn/button'
import type { Story } from '../model/types'

interface StoryItemProps {
  story: Story
  className?: string
}

export const StoryItem = memo(({ story, className }: StoryItemProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <article
      className={cn('rounded-lg border bg-card p-6 shadow-sm', className)}
    >
      {/* 작성자 정보 */}
      <div className="mb-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={story.author.avatar} alt={story.author.name} />
          <AvatarFallback>{story.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{story.author.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(story.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* 스토리 내용 */}
      <div className="mb-4">
        <h2 className="mb-2 font-bold text-foreground text-xl">
          {story.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed">{story.content}</p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'flex items-center gap-1',
            story.isLiked && 'text-red-500 hover:text-red-600',
          )}
        >
          <Heart className="h-4 w-4" />
          <span>{story.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{story.comments}</span>
        </Button>
      </div>
    </article>
  )
})
