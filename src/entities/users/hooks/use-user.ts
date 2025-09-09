'use client'

import useSWRImmutable from 'swr/immutable'
import { getUser } from '../api/get-user'

/**
 * 현재 로그인한 사용자 정보를 조회하는 훅
 */
export const useUser = () => {
  const { data, error, isLoading, mutate } = useSWRImmutable(
    '/users/me',
    getUser,
    {
      shouldRetryOnError: true,
      errorRetryCount: 2,
    },
  )

  return {
    user: data,
    isLoading,
    error,
    refresh: mutate,
  }
}
