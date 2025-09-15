'use client'

import type { SWRConfiguration } from 'swr'
import { authApi } from '@/shared/api/ky-client'
import { apiHelpers } from '@/shared/lib/api-helpers'
import type { ApiResponse } from '@/shared/types/api'

/**
 * SWR의 기본 fetcher 함수
 * authApi를 사용하여 자동으로 인증 토큰을 포함해서 요청합니다.
 * apiHelpers.extractData를 사용하여 일관된 데이터 추출을 수행합니다.
 */
const fetcher = async (url: string) => {
  const response = await authApi.get(url).json<ApiResponse<unknown>>()
  return apiHelpers.extractData(response)
}

/**
 * SWR 전역 설정 - 단순하고 실용적으로
 */
export const swrConfig: SWRConfiguration = {
  fetcher,

  // 프로젝트 요구사항에 맞는 설정
  dedupingInterval: 30000, // 30초 내 중복 요청 방지 (프로젝트 요구사항 반영)
  errorRetryCount: 2, // 에러 시 2번 재시도
  revalidateOnFocus: false, // 포커스 시 재검증 끔 (성능 향상)
  revalidateOnReconnect: true, // 네트워크 재연결 시만 재검증
  shouldRetryOnError: true, // 에러 시 재시도 활성화
}
