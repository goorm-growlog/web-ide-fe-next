import { api, apiHelpers } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'
import type { SignupFormData } from '../model/schema'
import type { SignupData } from './types'

/**
 * 회원가입 API
 * @param payload 회원가입 요청 데이터
 */
export const signup = async (payload: SignupFormData): Promise<SignupData> => {
  // 백엔드 API: POST /users/signup
  const response = await api
    .post('users/signup', {
      json: {
        email: payload.email,
        password: payload.password,
        name: payload.name,
      },
    })
    .json<ApiResponse<SignupData>>()

  return apiHelpers.extractData(response)
}
