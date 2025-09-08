// 프로젝트 관련 UI 상수 정의

// 프로젝트 UI 관련 상수들 - 실제로 재사용되는 것만 유지
export const PROJECT_DISPLAY_LIMITS = {
  HOST_SECTION_MAX_ITEMS: 3,
  INVITED_SECTION_MAX_ITEMS: 4,
  VISIBLE_MEMBERS_COUNT: 3,
} as const

export const PROJECT_CARD_HEIGHTS = {
  HOST_CARD: '150px',
  INVITED_CARD: '115px',
} as const

export const PROJECT_GRID_COLUMNS = {
  HOST_SECTION: 3,
  INVITED_SECTION: 2,
} as const
