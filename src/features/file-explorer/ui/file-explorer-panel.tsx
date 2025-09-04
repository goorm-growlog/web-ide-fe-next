'use client'

import type React from 'react'
import { useCallback } from 'react'
import { FILE_EXPLORER_TEXTS } from '@/features/file-explorer/constants/texts'
import type { FileSystemItem } from '@/features/file-explorer/model/types'
import { useFileActions } from '@/features/file-explorer/model/use-file-actions'
import { useFileOperations } from '@/features/file-explorer/model/use-file-operations'
import useFileTree from '@/features/file-explorer/model/use-file-tree'
import FileItem from '@/features/file-explorer/ui/file-item'
import { FILE_SHORTCUTS } from '@/shared/constants/keyboard-shortcuts'
import {
  ICON_SIZE_PX,
  INDENT_SIZE_PX,
  SCROLLABLE_PANEL_CONTENT_STYLES,
} from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'
import PanelLayout from '@/shared/ui/panel-layout'
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@/shared/ui/shadcn'

/**
 * 파일 탐색기의 루트 아이템 ID
 * @default '/'
 */
interface FileExplorerPanelProps {
  rootId?: string
}

export const FileExplorerPanel = ({ rootId = '/' }: FileExplorerPanelProps) => {
  const indent = INDENT_SIZE_PX
  const { containerProps, items, tree } = useFileTree({ rootId, indent })
  const rootItem = tree.getRootItem()

  const {
    createDialog,
    inputValue,
    setInputValue,
    handleNewFile,
    handleNewFolder,
    handleCreateConfirm,
    handleCreateCancel,
  } = useFileActions(rootId)
  const { copyPath, deleteItem } = useFileOperations()

  const { className: treeClassName, ...restContainerProps } = containerProps

  /**
   * 키보드 이벤트를 처리합니다.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault()

    switch (e.key) {
      case 'Enter':
        handleCreateConfirm()
        break
      case 'Escape':
        handleCreateCancel()
        break
      default:
        return
    }
  }

  const renderItemContextMenu = useCallback(
    (item: FileSystemItem) => {
      const isRoot = rootId === item.getId()

      return (
        <>
          <ContextMenuItem onClick={() => handleNewFile(item)}>
            {FILE_EXPLORER_TEXTS.NEW_FILE}
            <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FILE}</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleNewFolder(item)}>
            {FILE_EXPLORER_TEXTS.NEW_FOLDER}
            <ContextMenuShortcut>
              {FILE_SHORTCUTS.NEW_FOLDER}
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => copyPath(item.getId())}>
            {FILE_EXPLORER_TEXTS.COPY_PATH}
            <ContextMenuShortcut>
              {FILE_SHORTCUTS.COPY_PATH}
            </ContextMenuShortcut>
          </ContextMenuItem>
          {!isRoot && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => item.startRenaming()}>
                {FILE_EXPLORER_TEXTS.RENAME}
                <ContextMenuShortcut>
                  {FILE_SHORTCUTS.RENAME}
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem
                variant="destructive"
                onClick={() => deleteItem(item.getId())}
              >
                {FILE_EXPLORER_TEXTS.DELETE}
                <ContextMenuShortcut>
                  {FILE_SHORTCUTS.DELETE}
                </ContextMenuShortcut>
              </ContextMenuItem>
            </>
          )}
        </>
      )
    },
    [rootId, handleNewFile, handleNewFolder, copyPath, deleteItem],
  )

  return (
    <PanelLayout
      className={cn(SCROLLABLE_PANEL_CONTENT_STYLES, treeClassName)}
      {...restContainerProps}
    >
      {/* file context menu */}
      {items.map(item => (
        <ContextMenu key={item.getId()}>
          <ContextMenuTrigger>
            <FileItem item={item} indent={indent} iconSize={ICON_SIZE_PX} />
          </ContextMenuTrigger>
          <ContextMenuContent>{renderItemContextMenu(item)}</ContextMenuContent>
        </ContextMenu>
      ))}

      {/* root context menu */}
      <div className="flex-1">
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="h-full w-full"></div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {renderItemContextMenu(rootItem)}
          </ContextMenuContent>
        </ContextMenu>
      </div>

      {/* create file/folder dialog */}
      {createDialog.isOpen && (
        <Dialog
          open={true}
          onOpenChange={open => !open && handleCreateCancel()}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {createDialog.type === 'file'
                  ? FILE_EXPLORER_TEXTS.NEW_FILE
                  : FILE_EXPLORER_TEXTS.NEW_FOLDER}
              </DialogTitle>
            </DialogHeader>
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={
                createDialog.type === 'file'
                  ? FILE_EXPLORER_TEXTS.FILE_PLACEHOLDER
                  : FILE_EXPLORER_TEXTS.FOLDER_PLACEHOLDER
              }
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <DialogFooter>
              <Button variant="outline" onClick={handleCreateCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateConfirm}
                disabled={!inputValue.trim()}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PanelLayout>
  )
}

export default FileExplorerPanel
