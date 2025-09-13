import { logger } from '@/shared/lib/logger'

// 상수 정의 (성능 최적화)
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const DEFAULT_LOCALE = 'ko-KR' as const

// 날짜 포맷팅 유틸리티
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)

    // 유효하지 않은 날짜인지 확인
    if (Number.isNaN(date.getTime())) {
      return 'Invalid date'
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekday = WEEKDAYS[date.getDay()]

    return `${year}.${month}.${day} (${weekday})`
  } catch {
    logger.error('Failed to format date')
    return 'Invalid date'
  }
}

// 시간 포맷팅 유틸리티 (로케일 지원)
export const formatTime = (
  dateString: string,
  locale = DEFAULT_LOCALE,
): string => {
  try {
    const date = new Date(dateString)

    // 유효하지 않은 날짜인지 확인
    if (Number.isNaN(date.getTime())) {
      return 'Invalid time'
    }

    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    logger.error('Failed to format time')
    return 'Invalid time'
  }
}

// 날짜 그룹핑 유틸리티 (null 처리 강화)
export const groupByDate = <T extends { sentAt: string }>(
  items: T[],
): { [key: string]: T[] } => {
  if (!Array.isArray(items) || items.length === 0) return {}

  const groups: { [key: string]: T[] } = {}

  items.forEach(item => {
    // null/undefined 체크 강화
    if (
      !item ||
      typeof item !== 'object' ||
      !('sentAt' in item) ||
      !item.sentAt
    ) {
      logger.warn('Invalid item in groupByDate:', item)
      return
    }

    try {
      const date = new Date(item.sentAt)
      if (!Number.isNaN(date.getTime())) {
        const dateKey = date.toISOString().slice(0, 10) // Use stable ISO date key

        // 배열 초기화 최적화
        groups[dateKey] ??= []
        groups[dateKey].push(item)
      } else {
        logger.error('Invalid date format:', item.sentAt)
      }
    } catch (error) {
      logger.error('Error processing date:', { sentAt: item.sentAt, error })
    }
  })

  return groups
}
