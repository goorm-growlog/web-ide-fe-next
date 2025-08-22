import { useCallback, useState } from 'react'

/**
 * 간단한 로딩 상태만 관리하는 훅
 * 비동기 작업의 로딩 상태를 try-finally로 자동 관리합니다.
 */
export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false)

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>) => {
    setIsLoading(true)
    try {
      const result = await asyncFn()
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    withLoading,
    setIsLoading,
  }
}
