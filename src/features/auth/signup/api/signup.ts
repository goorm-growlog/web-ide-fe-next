import { api } from '@/shared/api/ky-client'
import { handleApiResponse } from '@/shared/lib/api-response-handler'
import type { ApiResponse } from '@/shared/types/api'
import type { SignupData, SignupFormData } from '../../model/types'

/**
 * 회원가입 API
 * @param payload 회원가입 요청 데이터
 */
export const signup = async (payload: SignupFormData) => {
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

  return handleApiResponse(response, 'Signup failed')
}
