'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { authApi } from '@/shared/api/ky-client'

const REFRESH_TEST_INTERVAL_MS = 1000

export default function TestPage() {
  const { data: session, status, update } = useSession()
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [eventLog, setEventLog] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 토큰 갱신 이벤트 모니터링
  useEffect(() => {
    const handleTokenRefresh = (event: Event) => {
      const custom = event as CustomEvent<{ accessToken?: string }>
      const newToken = custom.detail?.accessToken
      setEventLog(prev => [...prev, `🔄 [${new Date().toLocaleTimeString()}] 토큰 갱신 이벤트 수신: ${newToken ? '새 토큰 받음' : '토큰 없음'}`])
    }

    window.addEventListener('session-token-refresh', handleTokenRefresh)
    return () => window.removeEventListener('session-token-refresh', handleTokenRefresh)
  }, [])

  const addLog = (message: string) => {
    setEventLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const clearLog = () => {
    setEventLog([])
    setResult('')
  }

  const checkSession = () => {
    addLog('현재 세션 정보 확인')
    const isGitHub = session?.provider === 'github'
    const isKakao = session?.provider === 'kakao'
    
    setResult(`현재 세션 상태:
- 상태: ${status}
- 인증됨: ${status === 'authenticated' ? '✅' : '❌'}
- Provider: ${session?.provider || '없음'}
- AccessToken: ${session?.accessToken ? '✅ 있음' : '❌ 없음'}
- 토큰 길이: ${session?.accessToken?.length || 0}자
- 사용자: ${session?.user?.name || '없음'}
- 이메일: ${session?.user?.email || '없음'}

리프레시 토큰 예상 상태:
${isGitHub ? 
  '✅ GitHub: 리프레시 토큰이 설정되어야 함\n  - NextAuth → 백엔드 재로그인 시 credentials: include로 쿠키 설정' : 
  isKakao ? 
  '✅ Kakao: 리프레시 토큰이 설정되어 있을 가능성 높음\n  - 백엔드 리다이렉트 방식으로 쿠키 설정됨' :
  '❓ 일반 로그인: 백엔드 구현에 따라 다름'}`)
  }

  const testDirectRefresh = async () => {
    setIsLoading(true)
    addLog('직접 리프레시 API 호출 시작')
    setResult('직접 리프레시 테스트 중...')
    
    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        addLog(`✅ 직접 리프레시 성공: ${response.status}`)
        setResult(`✅ 직접 리프레시 성공:
상태: ${response.status}
응답: ${JSON.stringify(data, null, 2)}

🔍 디버깅 정보:
- HttpOnly 쿠키는 자동으로 전송됨 (credentials: 'include')
- 브라우저 개발자 도구 → Network 탭에서 Cookie 헤더 확인 가능
- 백엔드에서 리프레시 토큰을 찾지 못한다면 쿠키 이름이나 파싱 문제`)
      } else {
        addLog(`❌ 직접 리프레시 실패: ${response.status}`)
        const errorText = await response.text()
        setResult(`❌ 직접 리프레시 실패: ${response.status} ${response.statusText}
응답 내용: ${errorText}

🔍 디버깅 방법:
1. F12 → Network 탭에서 /auth/refresh 요청 확인
2. Request Headers → Cookie 필드에 'refresh=' 쿠키가 있는지 확인
3. 백엔드 로그에서 쿠키 파싱 상태 확인
4. 쿠키 이름이 'refresh'인지 확인 (다른 이름일 수 있음)

가능한 원인:
- 쿠키 이름 불일치 (refresh vs refreshToken vs refresh_token)
- 쿠키 도메인/경로 문제
- 백엔드 쿠키 파싱 오류
- 리프레시 토큰 만료`)
      }
    } catch (error) {
      addLog(`❌ 직접 리프레시 에러: ${error instanceof Error ? error.message : String(error)}`)
      setResult(`❌ 직접 리프레시 에러: ${error instanceof Error ? error.message : String(error)}

🔍 네트워크 에러 가능성:
- CORS 문제
- 프록시 설정 문제
- 백엔드 서버 연결 실패`)
    } finally {
      setIsLoading(false)
    }
  }

  const testApiCall = async () => {
    setIsLoading(true)
    addLog('API 호출을 통한 자동 리프레시 테스트 시작')
    setResult('API 호출 테스트 중...')
    
    try {
      // authApi를 사용하여 API 호출 (자동 리프레시 트리거)
      const response = await authApi.get('/users/me')
      const data = await response.json()
      
      addLog(`✅ API 호출 성공: ${response.status}`)
      setResult(`✅ API 호출 성공:
상태: ${response.status}
사용자 정보: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      addLog(`❌ API 호출 실패: ${error instanceof Error ? error.message : String(error)}`)
      setResult(`❌ API 호출 실패: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testMultipleRefresh = async () => {
    setIsLoading(true)
    addLog('연속 리프레시 테스트 시작')
    setResult('연속 리프레시 테스트 중...\n\n')
    
    for (let i = 1; i <= 3; i++) {
      try {
        addLog(`${i}번째 리프레시 시도`)
        const response = await fetch('/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })
        
        const status = response.ok ? '✅ 성공' : '❌ 실패'
        addLog(`${i}번째 리프레시: ${status} (${response.status})`)
        setResult(prev => prev + `${i}번째: ${status} (${response.status})\n`)
        
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, REFRESH_TEST_INTERVAL_MS))
        }
      } catch (error) {
        addLog(`${i}번째 리프레시 에러: ${error instanceof Error ? error.message : String(error)}`)
        setResult(prev => prev + `${i}번째: ❌ 에러\n`)
      }
    }
    
    addLog('연속 리프레시 테스트 완료')
    setIsLoading(false)
  }

  const testTokenExpiration = async () => {
    setIsLoading(true)
    addLog('토큰 만료 시뮬레이션 테스트 시작')
    setResult('토큰 만료 시뮬레이션 테스트 중...')
    
    try {
      // 잘못된 토큰으로 요청을 보내서 401을 유발
      const response = await fetch('/users/me', {
        headers: {
          'Authorization': 'Bearer invalid-token'
        },
        credentials: 'include'
      })
      
      addLog(`토큰 만료 시뮬레이션 응답: ${response.status}`)
      setResult(`토큰 만료 시뮬레이션 결과:
상태: ${response.status}
응답: ${response.statusText}`)
    } catch (error) {
      addLog(`토큰 만료 시뮬레이션 에러: ${error instanceof Error ? error.message : String(error)}`)
      setResult(`토큰 만료 시뮬레이션 에러: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeRefreshToken = () => {
    addLog('리프레시 토큰 상세 분석 시작')
    
    setResult(`❌ HttpOnly 쿠키는 JavaScript에서 접근할 수 없습니다!

리프레시 토큰은 HttpOnly 쿠키로 설정되어 있어서:
- document.cookie로 접근 불가
- JavaScript에서 토큰 내용을 읽을 수 없음
- 보안상 안전함 (XSS 공격으로부터 보호)

HttpOnly 쿠키 확인 방법:
1. 브라우저 개발자 도구 열기 (F12)
2. Application 탭 → Cookies → localhost
3. 'refresh' 쿠키 찾기
4. 값 확인 (JWT 토큰)

또는 Network 탭에서:
1. F12 → Network 탭
2. '직접 리프레시' 버튼 클릭
3. /auth/refresh 요청 클릭
4. Request Headers → Cookie 필드에서 확인

현재 JavaScript에서 접근 가능한 쿠키:
${document.cookie || '쿠키 없음'}

⚠️ 리프레시 토큰은 HttpOnly이므로 JavaScript로는 분석할 수 없습니다.
백엔드에서만 접근 가능하며, 자동 리프레시는 정상적으로 동작해야 합니다.`)
  }

  const checkCookies = () => {
    addLog('쿠키 상태 확인')
    const cookies = document.cookie.split(';').map(cookie => cookie.trim())
    const authCookies = cookies.filter(cookie => 
      cookie.includes('auth') || 
      cookie.includes('token') || 
      cookie.includes('session') ||
      cookie.includes('refresh')
    )
    
    setResult(`JavaScript에서 접근 가능한 쿠키:
전체 쿠키 수: ${cookies.length}
인증 관련 쿠키: ${authCookies.length}개
${authCookies.length > 0 ? authCookies.map(cookie => `- ${cookie}`).join('\n') : '인증 관련 쿠키 없음'}

⚠️ 중요: HttpOnly 쿠키는 JavaScript에서 접근할 수 없습니다!
- 리프레시 토큰은 HttpOnly 쿠키로 설정되어 있어서 document.cookie로 보이지 않습니다
- 브라우저 개발자 도구 → Application → Cookies에서 확인 가능
- Network 탭에서 요청 헤더의 Cookie 필드에서 확인 가능

전체 쿠키 목록 (JavaScript 접근 가능한 것만):
${cookies.map(cookie => `- ${cookie}`).join('\n')}

HttpOnly 쿠키 확인 방법:
1. F12 → Application → Cookies → localhost
2. F12 → Network → /auth/refresh 요청 → Request Headers → Cookie`)
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">🔐 리프레시 토큰 테스트 페이지</h1>
      
      {/* 현재 상태 표시 */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">📊 현재 상태</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>시간:</strong> {currentTime}
          </div>
          <div>
            <strong>세션 상태:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              status === 'authenticated' ? 'bg-green-100 text-green-800' : 
              status === 'loading' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {status}
            </span>
          </div>
          <div>
            <strong>Provider:</strong> {session?.provider || '없음'}
          </div>
          <div>
            <strong>토큰:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              session?.accessToken ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {session?.accessToken ? '있음' : '없음'}
            </span>
          </div>
        </div>
      </div>

      {/* 테스트 버튼들 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <h3 className="font-semibold">🔍 상태 확인</h3>
          <button
            onClick={checkSession}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            세션 정보 확인
          </button>
          <button
            onClick={checkCookies}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            쿠키 상태 확인
          </button>
          <button
            onClick={analyzeRefreshToken}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            리프레시 토큰 분석
          </button>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">🧪 리프레시 테스트</h3>
          <button
            onClick={testDirectRefresh}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            직접 리프레시
          </button>
          <button
            onClick={testApiCall}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
          >
            API 호출 (자동 리프레시)
          </button>
          <button
            onClick={testMultipleRefresh}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
          >
            연속 3회 테스트
          </button>
          <button
            onClick={testTokenExpiration}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            토큰 만료 시뮬레이션
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={clearLog}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          로그 초기화
        </button>
        {isLoading && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            테스트 중...
          </div>
        )}
      </div>

      {/* 결과 표시 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">📋 테스트 결과</h2>
          <pre className="whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
            {result || '테스트를 시작하세요.'}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">📝 이벤트 로그</h2>
          <div className="max-h-96 overflow-y-auto">
            {eventLog.length === 0 ? (
              <p className="text-gray-500 text-sm">이벤트 로그가 없습니다.</p>
            ) : (
              <div className="space-y-1">
                {eventLog.map((log, index) => (
                  <div key={index} className="text-xs font-mono bg-white p-2 rounded border">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}