import { api } from '../../api/api-client'
import type { SignupPayload, SignupResponse, User } from '../../model/types'

/**
 * 회원가입을 수행합니다.
 * @param payload 회원가입 요청 데이터 (이메일, 비밀번호, 이름, 프로필 이미지)
 * @returns 생성된 사용자 정보
 * @throws 회원가입 실패 시 에러
 */
export const signup = async (
  payload: SignupPayload,
): Promise<{ user: User }> => {
  const response = await api<SignupResponse>('/users/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  // API 응답 검증
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Signup failed')
  }

  const { userId, name, email, profileImage } = response.data

  // 사용자 객체 생성 (ID 변환 처리)
  const user: User = {
    id: userId?.toString() ?? 'unknown',
    email,
    ...(name && { name }),
    profileImage,
  }

  return { user }
}
