export const SOCIAL_LOGIN_LABELS = {
  KAKAO_LOGIN: 'kakao login',
  GITHUB_LOGIN: 'github login',
} as const

export const SOCIAL_PROVIDERS = {
  KAKAO: 'kakao',
  GITHUB: 'github',
} as const

export type SocialProvider =
  (typeof SOCIAL_PROVIDERS)[keyof typeof SOCIAL_PROVIDERS]
