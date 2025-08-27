'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/entities/auth/model/store'

interface UseAuthGuardResult {
  ensured: boolean
  redirecting: boolean
}

export const useAuthGuard = (): UseAuthGuardResult => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isRestored = useAuthStore(state => state.isRestored)
  const pathname = usePathname()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  const ensured = useMemo(
    () => isRestored && isAuthenticated,
    [isRestored, isAuthenticated],
  )

  useEffect(() => {
    if (!isRestored) return
    if (isAuthenticated) return
    setRedirecting(true)
    const search = new URLSearchParams({ redirect: pathname || '/' }).toString()
    router.replace(`/signin?${search}`)
  }, [isAuthenticated, isRestored, pathname, router])

  return { ensured, redirecting }
}
