// 날짜 포맷팅 유틸리티
export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekday = weekdays[date.getDay()]

  return `${year}.${month}.${day} (${weekday})`
}

// 시간 포맷팅 유틸리티
export const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// 날짜 그룹핑 유틸리티
export const groupByDate = <T extends { sentAt: string }>(items: T[]) => {
  const groups: { [key: string]: T[] } = {}

  items.forEach(item => {
    const dateKey = new Date(item.sentAt).toDateString()
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(item)
  })

  return groups
}
