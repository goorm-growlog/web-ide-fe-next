/**
 * 파일 트리 도메인 타입 정의
 */

// 파일 작업 상태 타입 (명확한 구분)
export type FileOperationStatus =
  | 'idle'
  | 'creating'
  | 'deleting'
  | 'moving'
  | 'error'

// 파일 작업 타입 (명확한 구분)
export type FileOperationType =
  | 'create-file'
  | 'create-folder'
  | 'delete-file'
  | 'delete-folder'
  | 'move-file'
  | 'move-folder'
  | 'rename-file'
  | 'rename-folder'

// 파일 노드 도메인 타입
export interface FileNode {
  id: string
  path: string
  type: 'file' | 'folder'
  children?: string[]
  isExpanded?: boolean
  isSelected?: boolean
}

// 파일 작업 컨텍스트 타입
export interface FileOperationContext {
  projectId: number
  currentPath: string
  selectedItems: FileNode[]
}

// 파일 작업 옵션 타입
export interface FileOperationOptions {
  skipConfirmation?: boolean
  showProgress?: boolean
  retryOnError?: boolean
}

// 파일 검증 결과 타입
export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}
