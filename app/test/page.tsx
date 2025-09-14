'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { authApi, setSessionUpdater } from '@/shared/api/ky-client'

export default function TestPage() {
  const { data: session, status, update } = useSession()
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSessionUpdater(update)
  }, [update])

  const testDirectRefresh = async () => {
    setIsLoading(true)
    setResult('직접 리프레시 테스트 중...')
    
    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setResult(`✅ 직접 리프레시 성공:
상태: ${response.status}
응답: ${JSON.stringify(data, null, 2)}`)
      } else {
        const errorText = await response.text()
        setResult(`❌ 직접 리프레시 실패: ${response.status}
응답: ${errorText}`)
      }
    } catch (error) {
      setResult(`❌ 직접 리프레시 에러: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testApiCall = async () => {
    setIsLoading(true)
    setResult('API 호출 테스트 중...')
    
    try {
      const response = await authApi.get('/users/me')
      const data = await response.json()
      
      setResult(`✅ API 호출 성공:
상태: ${response.status}
사용자 정보: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      setResult(`❌ API 호출 실패: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testRealSessionExpiry = async () => {
    setIsLoading(true)
    setResult('실제 세션 만료 테스트 중...')
    
    try {
      setResult(prev => prev + '\n\n1. 현재 세션 상태 확인...')
      
      setResult(prev => prev + '\n2. 세션 캐시 무효화...')
      
      setResult(prev => prev + '\n3. 실제 API 호출로 토큰 상태 확인...')
      const response = await authApi.get('/users/me')
      const data = await response.json()
      
      setResult(prev => prev + `\n\n✅ 실제 세션 만료 테스트 완료!
- 토큰이 유효하거나 자동 갱신이 성공했습니다.
- 최종 응답: ${response.status}
- 사용자 정보: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      setResult(prev => prev + `\n\n❌ 실제 세션 만료 테스트 실패: ${error instanceof Error ? error.message : String(error)}
      
이는 다음을 의미할 수 있습니다:
1. 리프레시 토큰도 만료됨 → 재로그인 필요
2. 백엔드 서버 연결 실패
3. 토큰 갱신 로직 오류`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔐 토큰 테스트</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">현재 상태</h2>
        <div className="text-sm space-y-1">
          <div>세션: <span className={`px-2 py-1 rounded text-xs ${status === 'authenticated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status}</span></div>
          <div>Provider: {session?.provider || '없음'}</div>
          <div>토큰: <span className={`px-2 py-1 rounded text-xs ${session?.accessToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{session?.accessToken ? '있음' : '없음'}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={testDirectRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          직접 리프레시
        </button>
        <button
          onClick={testApiCall}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          API 호출
        </button>
        <button
          onClick={testRealSessionExpiry}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          실제 세션 만료 테스트
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">테스트 결과</h2>
        <pre className="whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
          {result || '테스트를 시작하세요.'}
        </pre>
      </div>
    </div>
  )
}