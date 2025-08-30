import { NextResponse } from 'next/server'
import { api } from '@/shared/api/ky-client'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // 백엔드 로그인 API 호출
    const response = await api
      .post('auth/login', {
        json: { email, password },
        credentials: 'include',
      })
      .json()

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    // ky HTTPError 처리 - 백엔드 에러 메시지 그대로 전달
    if (error && typeof error === 'object' && 'name' in error && error.name === 'HTTPError' && 'response' in error) {
      const httpError = error as { response: Response }
      const body = await httpError.response.json()
      return NextResponse.json(body, { status: httpError.response.status })
    }
    
    // 기타 에러 처리
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String(error.message) 
      : '로그인에 실패했습니다.'
      
    return NextResponse.json(
      { error: { message: errorMessage } },
      { status: 500 },
    )
  }
}
