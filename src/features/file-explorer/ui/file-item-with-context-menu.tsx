import { useEffect, useRef } from 'react'
import { FILE_EXPLORER_UI_TEXTS } from '@/features/file-explorer/constants/ui-constants'
import { isDropTarget } from '@/features/file-explorer/lib/drag-drop-utils'
import type { FileItemWithContextMenuProps } from '@/features/file-explorer/types/file-explorer'
import FileItem from '@/features/file-explorer/ui/file-item'
import { FILE_SHORTCUTS } from '@/shared/constants/keyboard-shortcuts'
import { COMMON_UI_TEXTS } from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'
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
  onFileOpen,
}: FileItemWithContextMenuProps) => {
  const isRenamingRef = useRef(false)

  const handleOpenChange = (open: boolean) => {
    if (!open && item && isRenamingRef.current) {
      // Context Menu가 닫힐 때 포커스 복원
      setTimeout(() => {
        item.getTree().updateDomFocus()
      }, 0)
    }
  }

  const handleRenameAction = () => {
    if (item) {
      isRenamingRef.current = true
      onAction('rename', item)
    }
  }

  useEffect(() => {
    if (item?.isRenaming() && isRenamingRef.current) {
      // 이름 변경 모드가 활성화되면 포커스 설정
      setTimeout(() => {
        const element = item.getElement()
        if (element) {
          const input = element.querySelector('input')
          if (input) {
            input.focus()
            input.select()
          }
        }
        isRenamingRef.current = false
      }, 100)
    }
  }, [item])

  return (
    <ContextMenu onOpenChange={handleOpenChange}>
      <ContextMenuTrigger
        onContextMenu={() => {
          if (item) item.setFocused()
        }}
      >
        <div className={cn(item && isDropTarget(item) && 'bg-blue-50')}>
          <FileItem item={item} iconSize={iconSize} onFileOpen={onFileOpen} />
        </div>
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
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleRenameAction}>
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
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default FileItemWithContextMenu
