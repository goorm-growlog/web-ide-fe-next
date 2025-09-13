import type { ItemInstance } from '@headless-tree/core'
import type {
  FileActionType,
  FileNode,
} from '@/features/file-explorer/types/client'

/**
 * 파일 탐색기 관련 타입 정의
 */
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
