import { api, apiHelpers } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'
import type { LoginFormData } from '../model/schema'
import type { LoginData } from './types'

/**
 * 백엔드 로그인 API를 호출합니다.
 * @param data 로그인 폼 데이터
 * @returns 로그인 성공 시 사용자 데이터와 액세스 토큰
 */
export const loginApi = async (data: LoginFormData): Promise<LoginData> => {
  const response = await api
    .post('auth/login', {
      json: {
        email: data.email,
        password: data.password,
      },
    })
    .json<ApiResponse<LoginData>>()

  return apiHelpers.extractData(response)
}
