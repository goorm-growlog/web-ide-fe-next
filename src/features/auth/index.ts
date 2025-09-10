// 통합된 Auth 기능
// 백엔드 중심 토큰 관리 + 두 가지 방식의 소셜 로그인

// 토큰 관리
export { tokenManager, useTokenManager } from './lib/token-manager'

// 검증
export * from './lib/validation'
export { default as LoginForm } from './login/login-form'
// 로그인
export { useLoginActions } from './login/use-login-actions'
export { useLoginForm } from './login/use-login-form'

// 로그아웃
export { useLogout } from './logout/use-logout'
export { default as SocialLoginButtons } from './social/social-login-buttons' // UI 컴포넌트
export { useGitHubLogin } from './social/use-github-login' // GitHub (NextAuth 방식)
export { useKakaoLogin } from './social/use-kakao-login' // Kakao (백엔드 직접 방식)
// 소셜 로그인 - 두 가지 방식
export { useSocialLogin } from './social/use-social-login' // 통합 훅
