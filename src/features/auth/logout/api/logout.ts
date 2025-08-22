import { API_BASE, requestApi } from '@/shared/api/config'

/**
 * 로그아웃을 수행합니다.
 * @throws 로그아웃 실패 시 에러
 */
export const logout = async (): Promise<void> => {
  const url = `${API_BASE}/auth/logout`
  await requestApi(url, {
    method: 'POST',
  })
}
