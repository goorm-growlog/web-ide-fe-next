import type { LoginResult } from '../../login/model/types'

export const refreshAccessToken = async (): Promise<LoginResult> => {
  try {
    const res = await fetch(
      'https://growlog-web-ide.duckdns.org/auth/refresh',
      {
        method: 'POST',
        credentials: 'include', // HttpOnly 쿠키 자동 전송
      },
    )
    const body = await res.json().catch(() => ({}))
    if (!res.ok || !body.success || !body.data?.accessToken) {
      return {
        success: false,
        message: body?.error?.message ?? `HTTP ${res.status}`,
      }
    }
    return {
      success: true,
      message: '',
      token: body.data.accessToken,
    }
  } catch (err: unknown) {
    let message = 'Network error'
    if (typeof err === 'object' && err && 'message' in err) {
      const maybeMsg = (err as Record<string, unknown>).message
      if (typeof maybeMsg === 'string') message = maybeMsg
    }
    return {
      success: false,
      message,
    }
  }
}
