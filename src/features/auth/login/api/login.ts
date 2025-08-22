import type { LoginFormData, LoginResult } from '../model/types'

export const login = async (data: LoginFormData): Promise<LoginResult> => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        success: false,
        message: body?.message ?? `HTTP ${res.status}`,
      }
    }
    return {
      success: true,
      message: body?.message,
      // 필요시 body에서 토큰 등 추가
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network error',
    }
  }
}
