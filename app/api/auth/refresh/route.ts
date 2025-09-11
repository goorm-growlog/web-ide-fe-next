import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  // 실제 백엔드에서 사용하는 리프레시 토큰의 쿠키 이름을 확인해야 합니다.
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'Refresh token cookie not found' },
      { status: 401 },
    )
  }

  try {
    // 실제 백엔드의 토큰 갱신 API를 호출합니다.
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 이전 TokenManager의 방식대로, refreshToken을 body에 담아 보냅니다.
        body: JSON.stringify({ refreshToken }),
      },
    )

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      // 백엔드에서의 갱신 실패 응답을 그대로 클라이언트에 전달합니다.
      return NextResponse.json(data, { status: backendResponse.status })
    }

    const newAccessToken = data.data?.accessToken
    if (!newAccessToken) {
      return NextResponse.json(
        { error: 'New access token not provided by backend' },
        { status: 500 },
      )
    }

    // 새로 발급받은 accessToken을 클라이언트에 반환합니다.
    return NextResponse.json({ accessToken: newAccessToken })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 },
    )
  }
}
