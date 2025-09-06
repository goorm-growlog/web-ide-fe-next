import { NextRequest, NextResponse } from 'next/server'
import { forwardSetCookieHeaders, forceDeleteCookie } from '@/shared/lib/cookie-utils'

export async function POST(_request: NextRequest) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const nextResponse = NextResponse.json({ success: response.ok })

    // 백엔드가 내려준 Set-Cookie 헤더(쿠키 삭제 포함)를 그대로 포워딩
    forwardSetCookieHeaders(response, nextResponse)

    // 안전장치: refresh 쿠키 확실히 삭제
    forceDeleteCookie(nextResponse, 'refresh')

    return nextResponse
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { success: false, error: { message: 'logout failed.' } },
      { status: 500 },
    )
  }
}


