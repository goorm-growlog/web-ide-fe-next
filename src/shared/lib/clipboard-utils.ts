/**
 * 클립보드 유틸리티 함수
 * TOSS 원칙: Single Responsibility - 클립보드 관련 기능만 담당
 */

import { logger } from './logger'

/**
 * 텍스트를 클립보드에 복사
 * @param text - 복사할 텍스트
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    logger.error('Failed to copy to clipboard', error)
    throw error
  }
}
