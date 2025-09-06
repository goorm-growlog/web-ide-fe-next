'use client'

import useSWR from 'swr'
import { getUser } from '../api/get-user'

/**
 * 현재 로그인한 사용자 정보를 조회하는 SWR 훅
 *
 * 사용법:
 * const { user, isLoading, error } = useUser()
 *
 * - 자동 캐싱: 여러 컴포넌트에서 호출해도 1번만 요청
 * - 자동 동기화: 한 곳에서 변경되면 모든 곳에서 업데이트
 * - 자동 재시도: 네트워크 에러 시 자동 재시도
 */
export const useUser = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/users/me', // 간단한 키
    getUser, // fetcher 함수
    {
      // 사용자 정보 설정 - 수정 가능한 데이터이므로 짧은 캐시
      revalidateOnFocus: false, // 포커스 시 재검증 안함
      dedupingInterval: 1000, // 1초만 중복 요청 방지 (빠른 반영)
    },
  )

  return {
    user: data,
    isLoading,
    error,
    refresh: mutate, // 수동으로 새로고침할 때
    // 편의 속성들
    isLoggedIn: !!data && !error,
  }
}
