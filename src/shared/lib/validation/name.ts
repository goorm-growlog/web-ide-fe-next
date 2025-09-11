import { z } from 'zod'

// 이름 검증 메시지 상수
export const NAME_REQUIRED_MSG = 'Name must be at least 2 characters'
export const NAME_MIN_LENGTH_MSG = 'Name must be at least 2 characters'

// 이름 검증 스키마 (최소 2자로 기존 로직 유지)
export const nameSchema = z.string().trim().min(2, NAME_REQUIRED_MSG)
