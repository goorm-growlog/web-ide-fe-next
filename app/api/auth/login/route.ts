import { NextRequest, NextResponse } from 'next/server'
import { forwardSetCookieHeaders } from '@/shared/lib/cookie-utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // 백엔드 로그인 API 호출
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    
    // 🔥 핵심: 백엔드에서 받은 쿠키를 클라이언트로 포워딩
    const nextResponse = NextResponse.json(data, { status: 200 })
    forwardSetCookieHeaders(response, nextResponse)
    
    return nextResponse
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: { message: '로그인에 실패했습니다.' } },
      { status: 500 }
    )
  }
}
