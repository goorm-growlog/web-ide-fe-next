import type { ItemInstance } from '@headless-tree/core'
import { FILE_EXPLORER_TEXTS } from '@/features/file-explorer/constants/texts'
import type { FileNode } from '@/features/file-explorer/model/types'
import { FILE_SHORTCUTS } from '@/shared/constants/keyboard-shortcuts'
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@/shared/ui/shadcn/context-menu'

interface FileExplorerContextMenuProps {
  item: ItemInstance<FileNode>
  rootId: string
  onNewFile: (item: ItemInstance<FileNode>) => void
  onNewFolder: (item: ItemInstance<FileNode>) => void
}

export const FileExplorerContextMenu = ({
  item,
  rootId,
  onNewFile,
  onNewFolder,
}: FileExplorerContextMenuProps) => {
  const isRoot = rootId === item.getId()

  return (
    <>
      <ContextMenuItem onClick={() => onNewFile(item)}>
        {FILE_EXPLORER_TEXTS.NEW_FILE}
        <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FILE}</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => onNewFolder(item)}>
        {FILE_EXPLORER_TEXTS.NEW_FOLDER}
        <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FOLDER}</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={() => navigator.clipboard.writeText(item.getId())}
      >
        {FILE_EXPLORER_TEXTS.COPY_PATH}
        <ContextMenuShortcut>{FILE_SHORTCUTS.COPY_PATH}</ContextMenuShortcut>
      </ContextMenuItem>
      {!isRoot && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => item.startRenaming()}>
            {FILE_EXPLORER_TEXTS.RENAME}
            <ContextMenuShortcut>{FILE_SHORTCUTS.RENAME}</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            variant="destructive"
            onClick={() => console.log('Delete:', item.getId())}
          >
            {FILE_EXPLORER_TEXTS.DELETE}
            <ContextMenuShortcut>{FILE_SHORTCUTS.DELETE}</ContextMenuShortcut>
          </ContextMenuItem>
        </>
      )}
    </>
  )
}
