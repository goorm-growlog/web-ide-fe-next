import { useState } from 'react'

export interface UseCodeVerificationOptions {
  onVerifyCode?: (code: string) => Promise<boolean>
}

export const useCodeVerification = ({
  onVerifyCode,
}: UseCodeVerificationOptions = {}) => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

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

  const getButtonText = () => {
    if (isVerifying) return 'Verifying...'
    if (isVerified) return 'Verified'
    return 'Confirm'
  }

  return {
    isVerifying,
    isVerified,
    verifyCode,
    getButtonText,
  }
}
