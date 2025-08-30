import { api } from '@/shared/api/ky-client'
import { handleApiResponse } from '@/shared/lib/api-response-handler'
import type { SignupPayload, SignupResponse } from '../../model/types'

/**
 * 회원가입 API
 * @param payload 회원가입 요청 데이터
 */
export const signup = async (payload: SignupPayload) => {
  // 백엔드 API: POST /users/signup
  const response = await api
    .post('users/signup', {
      json: {
        email: payload.email,
        password: payload.password,
        name: payload.name, // 일관된 필드명 사용 (username → name)
      },
    })
    .json<SignupResponse>()

  return handleApiResponse(response, 'Signup failed')
}
