import type { LoginFormData } from '../model/use-login-form'

export const login = async (data: LoginFormData) => {
  // TODO: 실제 API 연동
  await new Promise(resolve => setTimeout(resolve, 1000))
  // 예시: return axios.post('/api/login', data)
  return { success: true }
}
