import type { PasswordResetData } from '@/features/auth/model/validation-schema'

export interface PasswordResetResult {
  success: boolean
  message?: string
}

export async function resetPassword(
  data: PasswordResetData,
): Promise<PasswordResetResult> {
  const res = await fetch(
    'https://growlog-web-ide.duckdns.org/auth/password-reset',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  )

  const body = await res.json().catch(() => ({}))

  if (!res.ok || !body.success) {
    return {
      success: false,
      message: body?.error?.message ?? `HTTP ${res.status}`,
    }
  }

  return {
    success: true,
    message: body.message || '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
  }
}
