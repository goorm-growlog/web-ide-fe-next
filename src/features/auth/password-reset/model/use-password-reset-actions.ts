import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import type { PasswordResetData } from '@/features/auth/model/validation-schema'
import { resetPassword } from '../api/reset-password'

export const usePasswordResetActions = () => {
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = useCallback(async (data: PasswordResetData) => {
    setIsLoading(true)
    try {
      const result = await resetPassword(data)

      if (!result.success) {
        const errorMsg =
          result.message || '비밀번호 재설정 요청에 실패했습니다.'
        toast.error(errorMsg)
        return false
      }

      toast.success(
        result.message || '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
      )
      return true // 성공 시 true 반환
    } catch {
      const message = '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    onSubmit,
  }
}
