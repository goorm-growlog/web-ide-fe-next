import { useCallback, useState } from 'react'
import type { EditorState } from '../types'

/**
 * Monaco Editor 상태 관리 훅
 * 완전 독립적으로 동작하며 기존 코드와 연동하지 않음
 */
export const useCodeEditor = (
  initialValue = '',
  initialLanguage = 'javascript',
) => {
  const [state, setState] = useState<EditorState>({
    value: initialValue,
    language: initialLanguage,
    isReady: false,
  })

  const updateValue = useCallback((newValue: string) => {
    setState(prev => ({ ...prev, value: newValue }))
  }, [])

  const updateLanguage = useCallback((newLanguage: string) => {
    setState(prev => ({ ...prev, language: newLanguage }))
  }, [])

  const setReady = useCallback((ready: boolean) => {
    setState(prev => ({ ...prev, isReady: ready }))
  }, [])

  return {
    ...state,
    updateValue,
    updateLanguage,
    setReady,
  }
}
