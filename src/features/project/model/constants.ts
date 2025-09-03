/**
 * 프로젝트 관련 상수 정의
 * 실제로 필요한 것들만 간소화
 */

// 프로젝트 목록 타입 (백엔드 API 파라미터)
export const PROJECT_LIST_TYPES = {
  OWN: 'own', // 자신이 만든 프로젝트
  JOINED: 'joined', // 참여 중인 프로젝트
} as const
