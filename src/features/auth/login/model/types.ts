// LoginResult는 UI 컴포넌트에서 사용하는 결과 타입 (API 응답과는 다름)
export interface LoginResult {
  success: boolean
  message?: string
  user?: {
    id: string
    email: string
    name?: string
  }
  errorCode?: string
}
