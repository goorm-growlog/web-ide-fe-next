import type { ItemInstance } from '@headless-tree/core'
import type { FileNode } from '@/features/file-explorer/types/client'

/**
 * 트리 핸들러 인터페이스
 * @param handleRename 파일/폴더 이름 변경 처리
 * @param handleDrop 드래그 앤 드롭 처리
 */
export interface TreeHandlers {
  readonly handleRename: (
    item: ItemInstance<FileNode>,
    value: string,
  ) => Promise<void> | void
  readonly handleDrop: (
    items: ItemInstance<FileNode>[],
    target: { item: ItemInstance<FileNode> },
  ) => Promise<void> | void
}

/**
 * 트리 핸들러 팩토리 파라미터
 * @param onRename 이름 변경 콜백
 * @param onMove 이동 콜백
 * @param onError 에러 처리 콜백
 */
export interface TreeHandlerParams {
  readonly onRename: (item: FileNode, newName: string) => Promise<void> | void
  readonly onMove: (fromPath: string, toPath: string) => Promise<void> | void
  readonly onError: (error: Error) => void
}

/**
 * 트리 데이터 로더 인터페이스
 * @param getItem 특정 ID의 아이템을 가져옴
 * @param getChildren 특정 아이템의 자식들을 가져옴
 */
export interface TreeDataLoader {
  readonly getItem: (itemId: string) => FileNode
  readonly getChildren: (itemId: string) => string[]
}
