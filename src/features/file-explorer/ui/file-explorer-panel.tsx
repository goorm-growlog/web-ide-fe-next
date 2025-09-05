'use client'

import { useRef } from 'react'
import { useFileActions } from '@/features/file-explorer/model/use-file-actions'
import useFileTree from '@/features/file-explorer/model/use-file-tree'
import FileCreateDialog, {
  type FileCreateDialogRef,
} from '@/features/file-explorer/ui/file-create-dialog'
import FileItem from '@/features/file-explorer/ui/file-item'
import FileItemContextMenu from '@/features/file-explorer/ui/file-item-context-menu'
import {
  ICON_SIZE_PX,
  SCROLLABLE_PANEL_CONTENT_STYLES,
} from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'
import PanelLayout from '@/shared/ui/panel-layout'

/**
 * 파일 탐색기의 루트 아이템 ID
 * @default '/'
 */
interface FileExplorerPanelProps {
  rootId?: string
}

export const FileExplorerPanel = ({ rootId = '/' }: FileExplorerPanelProps) => {
  const { containerProps, items, tree } = useFileTree({ rootId })
  const rootItem = tree.getRootItem()

  const dialogRef = useRef<FileCreateDialogRef>(null)
  const { contextMenuAction, dialogActions } = useFileActions(rootId, dialogRef)

  const { className: treeClassName, ...restContainerProps } = containerProps

  return (
    <PanelLayout
      className={cn(SCROLLABLE_PANEL_CONTENT_STYLES, treeClassName)}
      {...restContainerProps}
    >
      {items.map(item => (
        <FileItemContextMenu
          key={item.getId()}
          item={item}
          onAction={contextMenuAction}
        >
          <FileItem item={item} iconSize={ICON_SIZE_PX} />
        </FileItemContextMenu>
      ))}

      <div className="flex-1">
        <FileItemContextMenu item={rootItem} onAction={contextMenuAction}>
          <div className="h-full w-full" />
        </FileItemContextMenu>
      </div>

      <FileCreateDialog ref={dialogRef} {...dialogActions} />
    </PanelLayout>
  )
}

export default FileExplorerPanel
