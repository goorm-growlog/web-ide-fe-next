'use client'

import type { SWRConfiguration } from 'swr'
import { authApi } from '@/shared/api/ky-client'

/**
 * SWR의 기본 fetcher 함수
 * authApi를 사용하여 자동으로 인증 토큰을 포함해서 요청합니다.
 */
const fetcher = (url: string) => authApi.get(url).json()

/**
 * SWR 전역 설정 - 단순하고 실용적으로
 */
export const swrConfig: SWRConfiguration = {
  fetcher,

  // 합리적인 기본값들 - 사용자 수정 가능한 데이터 고려
  dedupingInterval: 5000, // 5초 내 중복 요청 방지 (빠른 반영)
  errorRetryCount: 2, // 에러 시 2번 재시도
  revalidateOnFocus: false, // 포커스 시 재검증 끔 (성능 향상)
  revalidateOnReconnect: true, // 네트워크 재연결 시만 재접증
}
