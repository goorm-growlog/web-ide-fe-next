'use client'

import { type PropsWithChildren, useEffect } from 'react'
import { useAuthRestore } from '@/entities/auth/model/restore'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  useAuthRestore()
  useEffect(() => {
    // no-op: 단순 마운트 트리거로 복원 실행
  }, [])
  return children
}

export default AuthProvider
