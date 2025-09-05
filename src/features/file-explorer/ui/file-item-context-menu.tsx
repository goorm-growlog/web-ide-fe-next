import type { ItemInstance } from '@headless-tree/core'
import type { ReactNode } from 'react'
import { FILE_EXPLORER_TEXTS } from '@/features/file-explorer/constants/texts'
import type { FileNode } from '@/features/file-explorer/model/types'
import { FILE_SHORTCUTS } from '@/shared/constants/keyboard-shortcuts'
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@/shared/ui/shadcn'

interface FileExplorerContextMenuProps {
  trigger: ReactNode
  item: ItemInstance<FileNode>
  rootId: string
  onNewFile: (item: ItemInstance<FileNode>) => void
  onNewFolder: (item: ItemInstance<FileNode>) => void
  onCopyPath: (path: string) => void
  onDelete: (path: string) => void
  onRename: () => void
}

const FileExplorerContextMenu = ({
  item,
  rootId,
  onNewFile,
  onNewFolder,
  onCopyPath,
  onDelete,
  onRename,
}: FileExplorerContextMenuProps) => {
  const isRoot = rootId === item.getId()

  return (
    <ContextMenuContent>
      <ContextMenuItem onClick={() => onNewFile(item)}>
        {FILE_EXPLORER_TEXTS.NEW_FILE}
        <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FILE}</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onNewFolder(item)}>
        {FILE_EXPLORER_TEXTS.NEW_FOLDER}
        <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FOLDER}</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      {/* navigator.clipboard.writeText(item.getId() */}
      <ContextMenuItem onClick={() => onCopyPath(item.getId())}>
        {FILE_EXPLORER_TEXTS.COPY_PATH}
        <ContextMenuShortcut>{FILE_SHORTCUTS.COPY_PATH}</ContextMenuShortcut>
      </ContextMenuItem>
      {!isRoot && (
        <>
          <ContextMenuSeparator />
          {/* item.startRenaming() */}
          <ContextMenuItem onClick={() => onRename()}>
            {FILE_EXPLORER_TEXTS.RENAME}
            <ContextMenuShortcut>{FILE_SHORTCUTS.RENAME}</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            variant="destructive"
            onClick={() => onDelete(item.getId())}
          >
            {FILE_EXPLORER_TEXTS.DELETE}
            <ContextMenuShortcut>{FILE_SHORTCUTS.DELETE}</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContent>
  )
}

export default FileExplorerContextMenu
