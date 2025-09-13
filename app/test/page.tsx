'use client'

import { useState } from 'react'

const REFRESH_TEST_INTERVAL_MS = 1000

export default function TestPage() {
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testRefresh = async () => {
    setIsLoading(true)
    setResult('테스트 중...')
    
    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setResult(`✅ 성공: ${JSON.stringify(data, null, 2)}`)
      } else {
        setResult(`❌ 실패: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setResult(`❌ 에러: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testMultiple = async () => {
    setIsLoading(true)
    setResult('연속 테스트 중...\n\n')
    
    for (let i = 1; i <= 3; i++) {
      try {
        const response = await fetch('/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })
        
        const status = response.ok ? '✅ 성공' : '❌ 실패'
        setResult(prev => prev + `${i}번째: ${status} (${response.status})\n`)
        
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, REFRESH_TEST_INTERVAL_MS))
        }
      } catch (error) {
        setResult(prev => prev + `${i}번째: ❌ 에러\n`)
      }
    }
    
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">리프레시 테스트</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? '테스트 중...' : '리프레시 테스트'}
        </button>
        
        <button
          onClick={testMultiple}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 ml-2"
        >
          {isLoading ? '테스트 중...' : '연속 3회 테스트'}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">결과:</h2>
        <pre className="whitespace-pre-wrap text-sm">{result || '테스트를 시작하세요.'}</pre>
      </div>
    </div>
  )
}