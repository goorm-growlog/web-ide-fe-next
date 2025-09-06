'use client'

import { type KeyboardEvent, useState } from 'react'
import { Button, Input } from '@/shared/ui/shadcn'

interface TextInputProps {
  placeholder?: string
  buttonText?: string
  disabled?: boolean
  onSend: (message: string) => void
}

export const TextInput = ({
  placeholder = 'Type your message...',
  buttonText = 'Send',
  disabled = false,
  onSend,
}: TextInputProps) => {
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-shrink-0 gap-3 bg-background p-4">
      <Input
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 text-foreground placeholder:text-muted-foreground"
        disabled={disabled}
      />
      <Button
        onClick={handleSubmit}
        disabled={!message.trim() || disabled}
        className="shrink-0 text-primary-foreground"
      >
        {buttonText}
      </Button>
    </div>
  )
}
