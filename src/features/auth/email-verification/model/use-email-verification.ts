import { useState } from 'react'

export interface UseEmailVerificationOptions {
  onSendCode?: (email: string) => Promise<void>
  onVerifyCode?: (code: string) => Promise<boolean>
}

export const useEmailVerification = ({
  onSendCode,
  onVerifyCode,
}: UseEmailVerificationOptions = {}) => {
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

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

  const verifyCode = async (code: string) => {
    if (!onVerifyCode || !code) return
    setIsVerifying(true)
    try {
      const success = await onVerifyCode(code)
      if (success) setIsVerified(true)
      return success
    } finally {
      setIsVerifying(false)
    }
  }

  const reset = () => {
    setIsCodeSent(false)
    setIsVerified(false)
    setIsSending(false)
    setIsVerifying(false)
  }

  return {
    isCodeSent,
    isVerified,
    isSending,
    isVerifying,
    sendCode,
    verifyCode,
    reset,
  }
}
