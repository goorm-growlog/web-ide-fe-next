import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh')?.value

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'Refresh token not found' },
      { status: 401 },
    )
  }

  try {
    // 백엔드 토큰 갱신 API 호출 - 쿠키를 포워딩
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 원래 요청의 쿠키를 백엔드에 전달 (httpOnly 쿠키 포함)
          'Cookie': cookieStore.toString()
        },
        // body에 refreshToken을 보내는 대신 쿠키로 전달하는 것이 더 안전
        credentials: 'include'
      },
    )

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status })
    }

    const newAccessToken = data.data?.accessToken
    if (!newAccessToken) {
      return NextResponse.json(
        { error: 'New access token not provided by backend' },
        { status: 500 },
      )
    }

    return NextResponse.json({ accessToken: newAccessToken })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 },
    )
  }
}
