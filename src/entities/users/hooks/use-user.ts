'use client'

import useSWR from 'swr'
import { getUser } from '../api/get-user'

/**
 * 현재 로그인한 사용자 정보를 조회하는 훅
 */
export const useUser = () => {
  const { data, error, isLoading, mutate } = useSWR('/users/me', getUser, {
    revalidateOnFocus: false,
  })

  return {
    user: data,
    isLoading,
    error,
    refresh: mutate,
  }
}
