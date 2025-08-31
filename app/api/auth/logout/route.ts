import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    // 백엔드 응답 본문은 크게 중요하지 않으므로 통일된 성공 JSON 반환
    const nextResponse = NextResponse.json({ success: response.ok })

    // 백엔드가 내려준 Set-Cookie 헤더(쿠키 삭제 포함)를 그대로 포워딩
    const setCookieHeaders =
      (response.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ||
      response.headers.get('set-cookie')?.split(', ') || []

    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie)
    })

    // 안전장치: 백엔드가 누락했을 가능성에 대비해 관련 쿠키 강제 삭제
    nextResponse.cookies.delete('refresh')
    nextResponse.cookies.delete('authjs.csrf-token')
    nextResponse.cookies.delete('authjs.callback-url')

    return nextResponse
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'logout failed.' } },
      { status: 500 },
    )
  }
}


