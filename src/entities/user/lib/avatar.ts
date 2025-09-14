import type { UserAvatarInfo } from '../model/types'

// 아바타 색상 팔레트 (16색)
const AVATAR_COLORS: readonly string[] = [
  '#FF6B6B', // 빨강
  '#4ECDC4', // 청록
  '#45B7D1', // 파랑
  '#96CEB4', // 민트
  '#FFEAA7', // 노랑
  '#DDA0DD', // 자주
  '#98D8C8', // 연두
  '#F7DC6F', // 황금
  '#BB8FCE', // 보라
  '#85C1E9', // 하늘
  '#F8C471', // 주황
  '#82E0AA', // 라임
  '#F1948A', // 연분홍
  '#85C1E9', // 하늘파랑
  '#D7BDE2', // 연보라
  '#A9DFBF', // 연초록
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
