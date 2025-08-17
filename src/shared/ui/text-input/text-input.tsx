'use client'

import type { KeyboardEvent } from 'react'
import { useState } from 'react'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import styles from './text-input.module.css'

interface TextInputProps {
  placeholder?: string
  buttonText?: string
  onSend: (message: string) => void
  disabled?: boolean
}

export const TextInput = ({
  placeholder = 'Type your message...',
  buttonText = 'Send',
  onSend,
  disabled = false,
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
    <div className={styles.inputContainer}>
      <Input
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={styles.input}
        disabled={disabled}
      />
      <Button
        onClick={handleSubmit}
        disabled={!message.trim() || disabled}
        className={styles.submitButton}
      >
        {buttonText}
      </Button>
    </div>
  )
}
