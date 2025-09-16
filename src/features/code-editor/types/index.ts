/**
 * 코드 에디터 관련 모든 타입 정의
 */

// ===== 에디터 설정 =====
export interface EditorConfig {
  language: string
  theme: string
  fontSize: number
  minimap: boolean
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
}

export interface EditorState {
  value: string
  language: string
  isReady: boolean
}

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  language: 'javascript',
  theme: 'vs-light',
  fontSize: 14,
  minimap: true,
  wordWrap: 'on',
}

// ===== 파일 관리 =====
export interface EditorFile {
  id: string
  name: string
  path: string
  content: string
  language: string
}

export interface FileEditorState {
  files: Record<string, EditorFile>
  activeFileId: string | null
  isLoading: boolean
}

export interface FileSystemIntegration {
  openFileFromTree: (filePath: string) => Promise<void>
  saveFile: (fileId: string) => Promise<void>
  closeFile: (fileId: string) => void
  getActiveFile: () => EditorFile | null
}

// ===== 탭 관리 =====
export interface FileTab {
  id: string
  name: string
  path: string
  isActive: boolean
}

export interface TabListProps {
  tabs: FileTab[]
  activeTabId: string | null
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onTabCopyPath: (tabId: string) => void
  onTabCloseOthers: (tabId: string) => void
  onTabCloseToRight: (tabId: string) => void
  onTabCloseAll: () => void
}

export interface TabItemProps {
  tab: FileTab
  onTabClick: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onTabCopyPath: (tabId: string) => void
  onTabCloseOthers: (tabId: string) => void
  onTabCloseToRight: (tabId: string) => void
  onTabCloseAll: () => void
}
