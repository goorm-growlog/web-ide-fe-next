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

    // 안전장치: 백엔드가 refresh 쿠키 삭제를 누락했을 경우에 대비
    nextResponse.cookies.delete('refresh')

    return nextResponse
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'logout failed.' } },
      { status: 500 },
    )
  }
}


