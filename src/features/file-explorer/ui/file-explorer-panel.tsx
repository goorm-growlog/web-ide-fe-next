'use client'

import { memo, useEffect, useRef } from 'react'
import { FILE_TREE_API_CONSTANTS } from '@/entities/file-tree/api/constants'
import { useFileActions } from '@/features/file-explorer/hooks/use-file-actions'
import type { FileTreeReturn } from '@/features/file-explorer/types/client'
import FileCreateDialog, {
  type FileCreateDialogRef,
} from '@/features/file-explorer/ui/file-create-dialog'
import FileItemWithContextMenu from '@/features/file-explorer/ui/file-item-with-context-menu'
import { FileTreeSkeleton } from '@/features/file-explorer/ui/file-tree-skeleton'
import RootItemContextMenu from '@/features/file-explorer/ui/root-item-context-menu'
import { ICON_SIZE_PX } from '@/shared/constants/ui'

interface FileExplorerPanelProps {
  fileTreeData: FileTreeReturn
  projectId: string
  onFileOpen?: ((filePath: string) => void) | undefined
}

const FileExplorerPanel = memo(
  ({ fileTreeData, projectId, onFileOpen }: FileExplorerPanelProps) => {
    const dialogRef = useRef<FileCreateDialogRef>(null)
    const { tree, isLoading } = fileTreeData

    const { contextMenu, dialogActions } = useFileActions(
      FILE_TREE_API_CONSTANTS.ROOT_PATH,
      projectId,
      dialogRef,
    )

    // 추가 단축키 구현
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // 현재 포커스된 아이템이 있는지 확인
        const focusedItem = tree.getFocusedItem()

        // ⌘⇧F: 새 파일 생성 (브라우저 기본 동작과 충돌 방지)
        if (e.metaKey && e.key === 'F' && e.shiftKey) {
          e.preventDefault()
          contextMenu('newFile', focusedItem)
        }

        // ⌘⇧D: 새 폴더 생성 (브라우저 기본 동작과 충돌 방지)
        if (e.metaKey && e.key === 'D' && e.shiftKey) {
          e.preventDefault()
          contextMenu('newFolder', focusedItem)
        }

        // ⌘⇧P: 경로 복사 (브라우저 기본 동작과 충돌 방지)
        if (e.metaKey && e.key === 'P' && e.shiftKey) {
          e.preventDefault()
          contextMenu('copyPath', focusedItem)
        }
      }

      // 트리 컨테이너에 키보드 이벤트 리스너 추가
      const container = document.querySelector('[data-tree-container]')
      if (container) {
        container.addEventListener('keydown', handleKeyDown as EventListener)
        return () => {
          container.removeEventListener(
            'keydown',
            handleKeyDown as EventListener,
          )
        }
      }
    }, [tree, contextMenu])

    if (isLoading) return <FileTreeSkeleton />

    return (
      <>
        {/*
        @headless-tree/core의 hotkeysCoreFeature가 키보드 이벤트를 처리하려면
        트리 컨테이너가 포커스 가능해야 합니다.

        참고: @headless-tree/core 공식 문서의 예제와 동일한 구조
        https://headless-tree.lukasbach.com/getstarted
      */}
        <div
          {...tree.getContainerProps()}
          className="flex h-full flex-col"
          data-tree-container
        >
          <div className="flex-none">
            {tree.getItems().map(item => (
              <FileItemWithContextMenu
                key={item.getId()}
                item={item}
                iconSize={ICON_SIZE_PX}
                onAction={contextMenu}
                onFileOpen={onFileOpen}
              />
            ))}
          </div>
          <div className="min-h-0 flex-1">
            <RootItemContextMenu
              onAction={contextMenu}
              item={tree.getRootItem()}
            />
          </div>
        </div>
        <FileCreateDialog ref={dialogRef} {...dialogActions} />
      </>
    )
  },
)

export default FileExplorerPanel
