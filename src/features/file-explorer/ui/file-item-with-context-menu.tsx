import { useMemo } from 'react'
import { FILE_EXPLORER_UI_TEXTS } from '@/features/file-explorer/constants/ui-constants'
import type { FileItemWithContextMenuProps } from '@/features/file-explorer/types/file-explorer'
import FileItem from '@/features/file-explorer/ui/file-item'
import { FILE_SHORTCUTS } from '@/shared/constants/keyboard-shortcuts'
import { COMMON_UI_TEXTS } from '@/shared/constants/ui'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/shared/ui/shadcn/context-menu'

const FileItemWithContextMenu = ({
  item,
  iconSize,
  onAction,
}: FileItemWithContextMenuProps) => {
  const isRoot = useMemo(() => {
    return item === null || item.getParent() === null
  }, [item])

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {item ? (
          <FileItem item={item} iconSize={iconSize} />
        ) : (
          // 루트 아이템의 경우 전체 영역을 차지하는 투명한 div
          <div className="absolute inset-0" />
        )}
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
        {!isRoot && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onAction('rename', item)}>
              {COMMON_UI_TEXTS.RENAME}
              <ContextMenuShortcut>{FILE_SHORTCUTS.RENAME}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              variant="destructive"
              onClick={() => onAction('delete', item)}
            >
              {COMMON_UI_TEXTS.DELETE}
              <ContextMenuShortcut>{FILE_SHORTCUTS.DELETE}</ContextMenuShortcut>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default FileItemWithContextMenu
