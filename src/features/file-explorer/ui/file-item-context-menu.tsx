import type { ItemInstance } from '@headless-tree/core'
import type { ReactNode } from 'react'
import { FILE_EXPLORER_TEXTS } from '@/features/file-explorer/constants/texts'
import type {
  FileActionType,
  FileNode,
} from '@/features/file-explorer/model/types'
import { FILE_SHORTCUTS } from '@/shared/constants/keyboard-shortcuts'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/shared/ui/shadcn'

interface FileItemContextMenuProps {
  readonly item: ItemInstance<FileNode>
  readonly onAction: (
    action: FileActionType,
    item: ItemInstance<FileNode>,
  ) => void
  readonly children?: ReactNode
}

const FileItemContextMenu = ({
  item,
  onAction,
  children,
}: FileItemContextMenuProps) => {
  const isRoot = item.getParent() == null

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => onAction('newFile', item)}>
          {FILE_EXPLORER_TEXTS.NEW_FILE}
          <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FILE}</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('newFolder', item)}>
          {FILE_EXPLORER_TEXTS.NEW_FOLDER}
          <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FOLDER}</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onAction('copyPath', item)}>
          {FILE_EXPLORER_TEXTS.COPY_PATH}
          <ContextMenuShortcut>{FILE_SHORTCUTS.COPY_PATH}</ContextMenuShortcut>
        </ContextMenuItem>
        {!isRoot && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onAction('rename', item)}>
              {FILE_EXPLORER_TEXTS.RENAME}
              <ContextMenuShortcut>{FILE_SHORTCUTS.RENAME}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              variant="destructive"
              onClick={() => onAction('delete', item)}
            >
              {FILE_EXPLORER_TEXTS.DELETE}
              <ContextMenuShortcut>{FILE_SHORTCUTS.DELETE}</ContextMenuShortcut>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default FileItemContextMenu
