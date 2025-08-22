import type { LoginFormData, LoginResult } from '../model/types'

export async function login(data: LoginFormData): Promise<LoginResult> {
  const res = await fetch('https://growlog-web-ide.duckdns.org/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body.success) {
    return {
      success: false,
      message: body?.error?.message ?? `HTTP ${res.status}`,
    }
  }
  return {
    success: true,
    message: '',
    token: body.data.accessToken,
    user: {
      id: String(body.data.userId),
      email: data.email,
      name: body.data.name,
    },
  }
}
