/**
 * 파일 및 폴더 관련 키보드 단축키
 */
export const FILE_SHORTCUTS = {
  NEW_FILE: '⌘⇧F',
  NEW_FOLDER: '⌘⇧D',
  RENAME: 'F2',
  DELETE: '⌫',
  COPY_PATH: '⌘⇧P',
} as const

/**
 * 탐색 관련 키보드 단축키
 */
export const NAVIGATION_SHORTCUTS = {
  FIND: '⌘F',
} as const

/**
 * 모든 단축키를 합친 타입
 */
export type KeyboardShortcut =
  | (typeof FILE_SHORTCUTS)[keyof typeof FILE_SHORTCUTS]
  | (typeof NAVIGATION_SHORTCUTS)[keyof typeof NAVIGATION_SHORTCUTS]
