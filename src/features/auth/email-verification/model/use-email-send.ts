import { useState } from 'react'

export interface UseEmailSendOptions {
  onSendCode?: (email: string) => Promise<void>
}

export const useEmailSend = ({ onSendCode }: UseEmailSendOptions = {}) => {
  const [isSending, setIsSending] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)

  const sendCode = async (email: string) => {
    if (!onSendCode || !email) return
    setIsSending(true)
    try {
      await onSendCode(email)
      setIsCodeSent(true)
    } finally {
      setIsSending(false)
    }
  }

  const reset = () => {
    setIsSending(false)
    setIsCodeSent(false)
  }

  return {
    isSending,
    isCodeSent,
    sendCode,
    reset,
  }
}
