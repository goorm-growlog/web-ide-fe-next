import type { UserAvatarInfo } from '../model/types'

// 아바타 색상 팔레트 (16색)
const AVATAR_COLORS: readonly string[] = [
  '#FF0000', // 순수 빨강
  '#FF6600', // 밝은 주황
  '#FFCC00', // 밝은 노랑
  '#FF0099', // 밝은 핑크
  '#FF9900', // 밝은 황금
  '#CC3300', // 밝은 적갈색
  '#9900FF', // 밝은 보라
  '#0066FF', // 밝은 파랑
  '#00CCCC', // 밝은 청록
  '#FF3366', // 밝은 로즈
  '#6600CC', // 밝은 자주
  '#FF6699', // 밝은 자홍
  '#3366FF', // 밝은 바이올렛
  '#0099FF', // 밝은 스카이블루
  '#CC0066', // 밝은 마젠타
  '#FF3300', // 밝은 오렌지레드
] as const

export function getUserInitials(name: string): string {
  if (!name || typeof name !== 'string') {
    return '?'
  }

  const trimmedName = name.trim()
  if (trimmedName.length === 0) {
    return '?'
  }

  // 첫 번째 글자만 반환
  return trimmedName[0]?.toUpperCase() || '?'
}

export function getUserColor(identifier: string): string {
  if (!identifier || typeof identifier !== 'string') {
    return AVATAR_COLORS[0] || '#FF6B6B'
  }

  let hash = 0
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[index] || '#FF6B6B'
}

export function getUserColorById(
  userId: number | string | undefined,
  name: string,
): string {
  if (userId !== undefined && userId !== null) {
    return getUserColor(`user_${userId}`)
  }
  return getUserColor(name)
}

export function createUserAvatarInfo(params: {
  name: string
  userId?: number | string | undefined
  profileImageUrl?: string | undefined
}): UserAvatarInfo {
  const { name, userId, profileImageUrl } = params
  const normalizedName = (name || '').trim()

  const avatarInfo: UserAvatarInfo = {
    initials: getUserInitials(normalizedName),
    color: getUserColorById(userId, normalizedName),
    name: normalizedName,
  }

  if (userId !== undefined && userId !== null) {
    avatarInfo.userId =
      typeof userId === 'string' ? parseInt(userId, 10) : userId
  }
  if (profileImageUrl !== undefined && profileImageUrl !== null) {
    avatarInfo.profileImageUrl = profileImageUrl
  }

  return avatarInfo
}

export function createUserAvatarsMap(
  users: Array<{
    name: string
    userId?: number | string
    profileImageUrl?: string
  }>,
): Map<string, UserAvatarInfo> {
  const avatarsMap = new Map<string, UserAvatarInfo>()

  users.forEach(user => {
    const avatarInfo = createUserAvatarInfo({
      name: user.name,
      userId: user.userId,
      profileImageUrl: user.profileImageUrl,
    })

    const key = user.userId ? `user_${user.userId}` : user.name
    avatarsMap.set(key, avatarInfo)
  })

  return avatarsMap
}
