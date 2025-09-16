/**
 * 파일 트리 API 관련 상수 정의
 * TOSS 원칙: Naming Magic Numbers - 매직 넘버를 명명된 상수로 정의
 */

export const FILE_TREE_API_CONSTANTS = {
  // API 타임아웃 설정
  REQUEST_TIMEOUT_MS: 10000,

  // 재시도 설정
  MAX_RETRY_ATTEMPTS: 1,

  // 파일 경로 관련
  ROOT_PATH: '/',
  PATH_SEPARATOR: '/',

  // 파일 타입
  FILE_TYPE: 'file' as const,
  FOLDER_TYPE: 'folder' as const,

  // 에러 메시지
  DEFAULT_SUCCESS_MESSAGE: '작업이 완료되었습니다.',
  DEFAULT_ERROR_MESSAGE: '작업 중 오류가 발생했습니다.',

  // 디바운싱 설정
  DEBOUNCE_DELAY_MS: 300,
} as const

// API 엔드포인트 상수 (절대 경로 사용)
export const FILE_TREE_ENDPOINTS = {
  CREATE_FILE: (projectId: number) => `/api/projects/${projectId}/files`,
  DELETE_FILE: (projectId: number) => `/api/projects/${projectId}/files`,
  MOVE_FILE: (projectId: number) => `/api/projects/${projectId}/files`,
} as const

// 에러 코드 상수
export const FILE_TREE_ERROR_CODES = {
  FILE_ALREADY_EXISTS: 'FILE_ALREADY_EXISTS',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INVALID_PATH: 'INVALID_PATH',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const
