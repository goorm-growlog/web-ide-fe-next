'use client'

import { Send } from 'lucide-react'
import { memo, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'
import { Textarea } from '@/shared/ui/shadcn/textarea'

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>
  disabled?: boolean
  placeholder?: string
  className?: string
}

export const MessageInput = memo(
  ({
    onSendMessage,
    disabled = false,
    placeholder = '메시지를 입력하세요...',
    className,
  }: MessageInputProps) => {
    const [content, setContent] = useState('')
    const [isSending, setIsSending] = useState(false)

    const handleSend = async () => {
      if (!content.trim() || isSending || disabled) return

      try {
        setIsSending(true)
        await onSendMessage(content.trim())
        setContent('')
      } catch (error) {
        console.error('Failed to send message:', error)
      } finally {
        setIsSending(false)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }

    return (
      <div className={cn('flex gap-2 border-t bg-background p-4', className)}>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          className="max-h-[120px] min-h-[40px] flex-1 resize-none"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!content.trim() || isSending || disabled}
          size="sm"
          className="self-end"
        >
          <Send className={cn('h-4 w-4', isSending && 'animate-pulse')} />
        </Button>
      </div>
    )
  },
)
