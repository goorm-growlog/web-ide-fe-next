export const getInitials = (username: string): string => {
  if (!username) return '?'

  const trimmed = username.trim()
  if (trimmed.length === 0) return '?'

  return trimmed.charAt(0).toUpperCase()
}
