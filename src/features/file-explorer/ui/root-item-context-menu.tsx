'use client'

import { FILE_EXPLORER_UI_TEXTS } from '@/features/file-explorer/constants/ui-constants'
import { isDropTarget } from '@/features/file-explorer/lib/drag-drop-utils'
import type { RootItemWithContextMenuProps } from '@/features/file-explorer/types/file-explorer'
import { FILE_SHORTCUTS } from '@/shared/constants/keyboard-shortcuts'
import { cn } from '@/shared/lib/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/shared/ui/shadcn/context-menu'

const RootItemContextMenu = ({
  onAction,
  item,
}: RootItemWithContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex-1">
        <div
          className={cn('h-full w-full', isDropTarget(item) && 'bg-blue-50')}
        />
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={() => onAction('newFile', item)}>
          {FILE_EXPLORER_UI_TEXTS.NEW_FILE}
          <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FILE}</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction('newFolder', item)}>
          {FILE_EXPLORER_UI_TEXTS.NEW_FOLDER}
          <ContextMenuShortcut>{FILE_SHORTCUTS.NEW_FOLDER}</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onAction('copyPath', item)}>
          {FILE_EXPLORER_UI_TEXTS.COPY_PATH}
          <ContextMenuShortcut>{FILE_SHORTCUTS.COPY_PATH}</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default RootItemContextMenu
