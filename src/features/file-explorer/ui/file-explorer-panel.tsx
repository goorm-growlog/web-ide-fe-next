'use client'

import { memo, useRef } from 'react'
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

    if (isLoading) return <FileTreeSkeleton />

    return (
      <>
        {/*
        @headless-tree/core의 hotkeysCoreFeature가 키보드 이벤트를 처리하려면
        트리 컨테이너가 포커스 가능해야 합니다.

        참고: @headless-tree/core 공식 문서의 예제와 동일한 구조
        https://headless-tree.lukasbach.com/getstarted
      */}
        <div {...tree.getContainerProps()} className="flex h-full flex-col">
          {tree.getItems().map(item => (
            <FileItemWithContextMenu
              key={item.getId()}
              item={item}
              iconSize={ICON_SIZE_PX}
              onAction={contextMenu}
              onFileOpen={onFileOpen}
            />
          ))}

          <RootItemContextMenu
            onAction={contextMenu}
            item={tree.getRootItem()}
          />
        </div>
        <FileCreateDialog ref={dialogRef} {...dialogActions} />
      </>
    )
  },
)

export default FileExplorerPanel
