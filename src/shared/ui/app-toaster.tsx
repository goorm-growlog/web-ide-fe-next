// sonner 토스트 메시지 UI를 앱 루트에 등록
import { Toaster } from 'sonner'

const AppToaster = () => (
  <Toaster
    richColors
    position="top-center"
    style={{ zIndex: 9999, pointerEvents: 'none' }}
    toastOptions={{ style: { pointerEvents: 'auto' } }}
  />
)

export default AppToaster
