import { toast } from 'sonner'
import { fetchApi } from '@/shared/api/fetch-api'
import type { ApiResponse } from '@/shared/types/api'

// API 응답 타입
interface EmailCodeData {
  success: boolean
  verified?: boolean
  message: string
}

type EmailCodeResponse = ApiResponse<EmailCodeData>

/**
 * 이메일 인증 코드 발송
 */
export const sendEmailCode = async (email: string): Promise<boolean> => {
  try {
    const response = await fetchApi<EmailCodeResponse>('/auth/email/send', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })

    if (!response.success || !response.data) {
      const errorMsg = response.error || 'Failed to send verification code'
      toast.error(errorMsg)
      throw new Error(errorMsg)
    }

    toast.success('Verification code sent successfully!')
    return response.data.success
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    }
    throw error
  }
}

/**
 * 이메일 인증 코드 검증
 */
export const verifyEmailCode = async (
  email: string,
  code: string,
): Promise<boolean> => {
  try {
    const response = await fetchApi<EmailCodeResponse>('/auth/email/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    })

    if (!response.success || !response.data) {
      const errorMsg = response.error || 'Invalid verification code'
      toast.error(errorMsg)
      throw new Error(errorMsg)
    }

    const verified = response.data.verified ?? false
    if (verified) {
      toast.success('Email verified successfully!')
    }

    return verified
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message)
    }
    throw error
  }
}
