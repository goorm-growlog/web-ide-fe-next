import { z } from 'zod'

// 이메일 검증 메시지 상수
export const EMAIL_REQUIRED_MSG = 'Please enter a valid email address'

// 이메일 검증 스키마
export const emailSchema = z.string().trim().email(EMAIL_REQUIRED_MSG)
