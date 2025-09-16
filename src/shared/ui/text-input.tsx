'use client'

import { type KeyboardEvent, useRef, useState } from 'react'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'

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
  const isComposingRef = useRef(false)
  const lastSubmitTimeRef = useRef(0)

  const handleSubmit = () => {
    // 한글 입력 조합 중이거나 비활성화 상태면 전송하지 않음
    if (isComposingRef.current || !message.trim() || disabled) {
      return
    }

    // 중복 전송 방지 (100ms 내 중복 클릭/키 입력 방지)
    const now = Date.now()
    if (now - lastSubmitTimeRef.current < 100) {
      return
    }
    lastSubmitTimeRef.current = now

    onSend(message.trim())
    setMessage('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposingRef.current) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = () => {
    isComposingRef.current = false
  }

  return (
    <div className="flex flex-shrink-0 gap-3 bg-background p-4">
      <Input
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder={placeholder}
        className="flex-1 text-foreground placeholder:text-muted-foreground"
        disabled={disabled}
      />
      <Button
        onClick={handleSubmit}
        disabled={!message.trim() || disabled || isComposingRef.current}
        className="shrink-0 text-primary-foreground"
      >
        {buttonText}
      </Button>
    </div>
  )
}
