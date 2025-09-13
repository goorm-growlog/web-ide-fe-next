'use client'

import { useParams } from 'next/navigation'
import { memo, useMemo, useRef } from 'react'
import { FILE_TREE_CONSTANTS } from '@/features/file-explorer/constants/file-tree-constants'
import { FILE_EXPLORER_UI_TEXTS } from '@/features/file-explorer/constants/ui-constants'
import { useFileActions } from '@/features/file-explorer/hooks/use-file-actions'
import useFileTree from '@/features/file-explorer/hooks/use-file-tree'
import FileCreateDialog, {
  type FileCreateDialogRef,
} from '@/features/file-explorer/ui/file-create-dialog'
import FileItemWithContextMenu from '@/features/file-explorer/ui/file-item-with-context-menu'
import { FileTreeSkeleton } from '@/features/file-explorer/ui/file-tree-skeleton'
import {
  COMMON_UI_TEXTS,
  ICON_SIZE_PX,
  SCROLLABLE_PANEL_CONTENT_STYLES,
} from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'
import PanelLayout from '@/shared/ui/panel-layout'

const FileExplorerPanel = memo(() => {
  const params = useParams()
  const projectId = params.projectId

  const dialogRef = useRef<FileCreateDialogRef>(null)
  const { contextMenuAction, dialogActions } = useFileActions(
    FILE_TREE_CONSTANTS.ROOT_PATH,
    dialogRef,
  )

  const { tree, isLoading } = useFileTree(String(projectId || ''))

  const containerProps = useMemo(() => {
    const { className: treeClassName, ...restContainerProps } =
      tree?.getContainerProps() ?? {}
    return { treeClassName, restContainerProps }
  }, [tree])

  const EmptyState = () => (
    <PanelLayout className={cn(SCROLLABLE_PANEL_CONTENT_STYLES)}>
      <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground">
        <div className="text-center">
          <h3 className="mb-2 font-medium text-lg">
            {COMMON_UI_TEXTS.NO_ITEMS_AVAILABLE}
          </h3>
          <p className="text-sm">{FILE_EXPLORER_UI_TEXTS.START_PROJECT}</p>
        </div>
      </div>
    </PanelLayout>
  )

  if (isLoading) {
    return (
      <PanelLayout className={cn(SCROLLABLE_PANEL_CONTENT_STYLES)}>
        <FileTreeSkeleton />
      </PanelLayout>
    )
  }

  if (!tree) return <EmptyState />

  return (
    <PanelLayout
      className={cn(
        SCROLLABLE_PANEL_CONTENT_STYLES,
        containerProps.treeClassName,
      )}
      {...containerProps.restContainerProps}
    >
      {tree.getItems().map(item => (
        <FileItemWithContextMenu
          key={item.getId()}
          item={item}
          iconSize={ICON_SIZE_PX}
          onAction={contextMenuAction}
        />
      ))}
      <div className="relative flex-1">
        <FileItemWithContextMenu
          item={null}
          iconSize={ICON_SIZE_PX}
          onAction={contextMenuAction}
        />
      </div>
      <FileCreateDialog ref={dialogRef} {...dialogActions} />
    </PanelLayout>
  )
})

export default FileExplorerPanel
