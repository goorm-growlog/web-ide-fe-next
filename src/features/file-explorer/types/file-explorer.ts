import type { ItemInstance } from '@headless-tree/core'
import type { FileActionType, FileNode } from './client'

/**
 * 파일 탐색기 관련 타입 정의
 * KISS + YAGNI 원칙 적용: 실제 사용되는 타입만 정의
 */

// 실제 사용되는 컴포넌트 Props 타입들
export interface FileItemProps {
  readonly item: ItemInstance<FileNode>
  readonly iconSize: number
}

export interface FileItemWithContextMenuProps {
  readonly item: ItemInstance<FileNode> | null
  readonly iconSize: number
  readonly onAction: (
    action: FileActionType,
    item: ItemInstance<FileNode> | null,
  ) => void
}
