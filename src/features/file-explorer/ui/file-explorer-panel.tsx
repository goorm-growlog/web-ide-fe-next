'use client'

import type { ItemInstance } from '@headless-tree/core'
import { useCallback, useState } from 'react'
import useFileTree from '@/features/file-explorer/hooks/use-file-tree'
import { handleNewFile as createFileHandler } from '@/features/file-explorer/lib/new-file-handler'
import { handleNewFolder as createFolderHandler } from '@/features/file-explorer/lib/new-folder-handler'
import type { FileNode } from '@/features/file-explorer/model/types'
import FileItem from '@/features/file-explorer/ui/file-item'
import { FILE_SHORTCUTS } from '@/shared/constants/keyboard-shortcuts'
import {
  ICON_SIZE_PX,
  INDENT_SIZE_PX,
  SCROLLABLE_PANEL_CONTENT_STYLES,
} from '@/shared/constants/ui'
import PanelLayout from '@/shared/ui/panel-layout'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/shared/ui/shadcn/context-menu'

interface FileExplorerPanelProps {
  rootItemId?: string
}

const getTargetPath = (item: ItemInstance<FileNode>) => {
  return item.isFolder()
    ? item.getId()
    : item.getId().substring(0, item.getId().lastIndexOf('/'))
}

export const FileExplorerPanel = ({
  rootItemId = '/',
}: FileExplorerPanelProps) => {
  const indent = INDENT_SIZE_PX
  const [contextItem, setContextItem] = useState<ItemInstance<FileNode> | null>(
    null,
  )
  const { containerProps, items, tree } = useFileTree({ rootItemId, indent })
  const { className: treeClassName, ...restContainerProps } = containerProps

  const handleItemContextMenu = useCallback(
    (item: ItemInstance<FileNode>) => {
      if (!item.isFocused()) {
        item.setFocused()
        tree.updateDomFocus()
      }
      setContextItem(item)
    },
    [tree],
  )

  const handleNewFile = useCallback((item: ItemInstance<FileNode>) => {
    if (item.isFolder()) item.expand()
    const targetPath = getTargetPath(item)
    const fileName = prompt('새 파일 이름을 입력하세요:', '새 파일.txt')

    if (fileName) {
      createFileHandler(targetPath, fileName)
    }
  }, [])

  const handleNewFolder = useCallback((item: ItemInstance<FileNode>) => {
    if (item.isFolder()) item.expand()
    const targetPath = getTargetPath(item)
    const folderName = prompt('새 폴더 이름을 입력하세요:', '새 폴더')

    if (folderName) {
      createFolderHandler(targetPath, folderName)
    }
  }, [])

  const renderItemMenu = useCallback(
    (item: ItemInstance<FileNode>) => {
      const isRoot = item.getId() === '/'

      return (
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleNewFile(item)}>
            New File
            <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FILE}</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleNewFolder(item)}>
            New Folder
            <ContextMenuShortcut>
              {FILE_SHORTCUTS.NEW_FOLDER}
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => navigator.clipboard.writeText(item.getId())}
          >
            Copy Path
            <ContextMenuShortcut>
              {FILE_SHORTCUTS.COPY_PATH}
            </ContextMenuShortcut>
          </ContextMenuItem>
          {!isRoot && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => item.startRenaming()}>
                Rename
                <ContextMenuShortcut>
                  {FILE_SHORTCUTS.RENAME}
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem
                variant="destructive"
                onClick={() => console.log('Delete:', item.getId())}
              >
                Delete
                <ContextMenuShortcut>
                  {FILE_SHORTCUTS.DELETE}
                </ContextMenuShortcut>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      )
    },
    [handleNewFile, handleNewFolder],
  )

  return (
    <PanelLayout className={treeClassName}>
      <div className={SCROLLABLE_PANEL_CONTENT_STYLES} {...restContainerProps}>
        {items.map(item => (
          <ContextMenu key={item.getId()}>
            <ContextMenuTrigger
              onContextMenu={() => handleItemContextMenu(item)}
            >
              <FileItem item={item} indent={indent} iconSize={ICON_SIZE_PX} />
            </ContextMenuTrigger>
            {contextItem?.getId() === item.getId() &&
              renderItemMenu(contextItem)}
          </ContextMenu>
        ))}
      </div>
    </PanelLayout>
  )
}

export default FileExplorerPanel
