/**
 * @todo 실제 인증 시스템과 연동 후 제거
 */
export const DEFAULT_USER_CONFIG = {
  /** 기본 사용자 ID */
  DEFAULT_USER_ID: 1,
  /** 기본 사용자명 */
  DEFAULT_USERNAME: 'username',
  /** 현재 사용자 모킹 ID */
  MOCK_CURRENT_USER_ID: 2,
  /** 모킹 사용자 프로필 */
  MOCK_USER_PROFILE: {
    username: 'mockUsername',
    userImg: 'mockImg',
  },
} as const

/**
 * 메시지 관련 설정
 */
export const MESSAGE_CONFIG = {
  /** 새 메시지 전송 시뮬레이션 딜레이 (ms) */
  SEND_MESSAGE_DELAY: 1000,
  /** 기본 메시지 전송 시간 */
  DEFAULT_SENT_AT: '2025-01-15T09:01:00Z',
} as const

/**
 * 시스템 메시지 템플릿
 */
export const SYSTEM_MESSAGE_TEMPLATES = {
  USER_JOINED: (username: string) => `${username} joined this chatroom.`,
  USER_LEFT: (username: string) => `${username} left this chatroom.`,
} as const
