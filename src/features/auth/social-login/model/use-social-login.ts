export const useSocialLogin = () => {
  const onSocialLogin = (_provider: string) => {
    // TODO: 소셜 로그인 로직 구현
    // 예: window.location.href = `/auth/social/${_provider}`
  }

  return {
    onSocialLogin,
  }
}
