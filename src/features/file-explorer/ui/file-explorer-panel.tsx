'use client'

import { useParams } from 'next/navigation'
import { useMemo, useRef } from 'react'
import { FILE_TREE_CONSTANTS } from '@/features/file-explorer/constants/file-tree-constants'
import { FILE_EXPLORER_UI_TEXTS } from '@/features/file-explorer/constants/ui-texts'
import { useFileActions } from '@/features/file-explorer/hooks/use-file-actions'
import useFileTree from '@/features/file-explorer/hooks/use-file-tree'
import FileCreateDialog, {
  type FileCreateDialogRef,
} from '@/features/file-explorer/ui/file-create-dialog'
import FileItemWithContextMenu from '@/features/file-explorer/ui/file-item-with-context-menu'
import { FileTreeSkeleton } from '@/features/file-explorer/ui/file-tree-skeleton'
import {
  ICON_SIZE_PX,
  SCROLLABLE_PANEL_CONTENT_STYLES,
} from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'
import PanelLayout from '@/shared/ui/panel-layout'

const FileExplorerPanel = () => {
  const params = useParams()
  const projectId = params.projectId as string
  const { tree, isLoading, error, refresh } = useFileTree(projectId)

  const dialogRef = useRef<FileCreateDialogRef>(null)
  const { contextMenuAction, dialogActions } = useFileActions(
    FILE_TREE_CONSTANTS.ROOT_PATH,
    dialogRef,
  )

  const containerProps = useMemo(() => {
    const { className: treeClassName, ...restContainerProps } =
      tree?.getContainerProps() ?? {}
    return { treeClassName, restContainerProps }
  }, [tree])

  // 에러 상태 UI 컴포넌트
  const ErrorState = () => (
    <PanelLayout className={cn(SCROLLABLE_PANEL_CONTENT_STYLES)}>
      <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground">
        <div className="text-center">
          <h3 className="mb-2 font-medium text-lg">
            {FILE_EXPLORER_UI_TEXTS.ERROR_LOADING_FILES}
          </h3>
          <p className="text-sm">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            {FILE_EXPLORER_UI_TEXTS.RETRY}
          </button>
        </div>
      </div>
    </PanelLayout>
  )

  // 빈 상태 UI 컴포넌트
  const EmptyState = () => (
    <PanelLayout className={cn(SCROLLABLE_PANEL_CONTENT_STYLES)}>
      <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground">
        <div className="text-center">
          <h3 className="mb-2 font-medium text-lg">
            {FILE_EXPLORER_UI_TEXTS.NO_FILES_AVAILABLE}
          </h3>
          <p className="text-sm">
            {FILE_EXPLORER_UI_TEXTS.FILE_TREE_LOAD_ERROR}
          </p>
        </div>
      </div>
    </PanelLayout>
  )

  // 🎯 Error state
  if (error) return <ErrorState />

  // 🎯 File tree loading
  if (isLoading) {
    return (
      <PanelLayout className={cn(SCROLLABLE_PANEL_CONTENT_STYLES)}>
        <FileTreeSkeleton />
      </PanelLayout>
    )
  }

  // 🎯 No tree data
  if (!tree) return <EmptyState />

  return (
    <PanelLayout
      className={cn(
        SCROLLABLE_PANEL_CONTENT_STYLES,
        containerProps.treeClassName,
      )}
      {...containerProps.restContainerProps}
    >
      {/* 파일 아이템들 */}
      {tree.getItems().map(item => (
        <FileItemWithContextMenu
          key={item.getId()}
          item={item}
          iconSize={ICON_SIZE_PX}
          onAction={contextMenuAction}
        />
      ))}
      {/* 남는 공간을 차지하는 루트 ContextMenu 영역 */}
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
}

export default FileExplorerPanel
