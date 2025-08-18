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
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weekday = weekdays[date.getDay()]

    return `${year}.${month}.${day} (${weekday})`
  } catch {
    return 'Invalid date'
  }
}

// 시간 포맷팅 유틸리티
export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString)

    // 유효하지 않은 날짜인지 확인
    if (Number.isNaN(date.getTime())) {
      return 'Invalid time'
    }

    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return 'Invalid time'
  }
}

// 날짜 그룹핑 유틸리티
export const groupByDate = <T extends { sentAt: string }>(
  items: T[],
): { [key: string]: T[] } => {
  if (!Array.isArray(items)) return {}

  const groups: { [key: string]: T[] } = {}

  items.forEach(item => {
    if (item && typeof item === 'object' && 'sentAt' in item) {
      try {
        const date = new Date(item.sentAt)
        if (!Number.isNaN(date.getTime())) {
          const dateKey = date.toDateString()
          if (!groups[dateKey]) {
            groups[dateKey] = []
          }
          groups[dateKey].push(item)
        }
      } catch {
        // 날짜 파싱 실패 시 무시
        console.warn('Failed to parse date:', item.sentAt)
      }
    }
  })

  return groups
}
