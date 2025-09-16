'use client'

import { useEffect, useState } from 'react'
// sonner 토스트 메시지 UI를 앱 루트에 등록
import { Toaster } from 'sonner'

const AppToaster = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 클라이언트에서만 렌더링
  if (!isClient) {
    return null
  }

  return (
    <Toaster
      richColors
      position="top-center"
      style={{ zIndex: 9999, pointerEvents: 'none' }}
      toastOptions={{ style: { pointerEvents: 'auto' } }}
    />
  )
}

export default AppToaster
export { AppToaster }
