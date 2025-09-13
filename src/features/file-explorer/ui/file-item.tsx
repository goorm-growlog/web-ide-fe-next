'use client'

import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { isItemDropZone } from '@/features/file-explorer/lib/drop-zone-helpers'
import type { FileItemProps } from '@/features/file-explorer/types/file-explorer'
import { INDENT_SIZE_PX } from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'

const FileItem = ({ item, iconSize }: FileItemProps) => {
  const level = item.getItemMeta().level
  const isFolder = item.isFolder()
  const isExpanded = item.isExpanded()
  const isSelected = item.isSelected()
  const isFocused = item.isFocused()

  const handleContextMenu = useCallback(() => {
    if (isFolder && !isExpanded) {
      item.expand()
    }
  }, [isFolder, isExpanded, item])

  const paddingLeft = useMemo(
    () => level * INDENT_SIZE_PX + iconSize,
    [level, iconSize],
  )

  const iconElement = useMemo(() => {
    if (isFolder) {
      return (
        <>
          <ChevronRightIcon
            data-state={isExpanded ? 'open' : 'closed'}
            className={cn(
              'transition-transform duration-200',
              isExpanded ? 'rotate-90' : 'rotate-0',
            )}
            size={iconSize}
          />
          {isExpanded ? (
            <FolderOpenIcon size={iconSize} />
          ) : (
            <FolderIcon size={iconSize} />
          )}
        </>
      )
    }
    return (
      <>
        <div className="flex-shrink-0" style={{ width: `${iconSize}px` }} />
        <FileIcon size={iconSize} />
      </>
    )
  }, [isFolder, isExpanded, iconSize])

  const {
    className: itemClassName,
    // headless-tree의 onContextMenu는 preventDefault()를 호출해서 브라우저 기본 컨텍스트 메뉴를 차단함
    // shadcn/ui ContextMenu를 사용하기 위해서는 이 핸들러를 제거하고 이벤트 전파를 허용해야 함
    onContextMenu: _,
    ...restProps
  } = item.getProps()

  return (
    <button
      type="button"
      {...restProps}
      data-file-item
      onContextMenu={handleContextMenu}
      className={cn(
        itemClassName,
        isItemDropZone(item) && 'bg-blue-50',
        // Default styles
        'flex w-full cursor-pointer items-center gap-1 py-1',
        'transition-colors duration-150 ease-in-out',
        // Keyboard accessibility
        'focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-inset',
        // State-specific styles (priority: selected > focused > hover)
        isSelected && 'bg-sidebar-accent text-sidebar-accent-foreground',
        !isSelected &&
          isFocused &&
          'rounded ring-2 ring-sidebar-ring ring-inset',
        !isSelected && 'hover:bg-sidebar-accent/30',
      )}
    >
      <div className="flex gap-1" style={{ paddingLeft }}>
        {iconElement}
      </div>
      <div className="flex w-full gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {item.isRenaming() ? (
          <input
            {...item.getRenameInputProps()}
            onFocus={e => e.target.select()}
          />
        ) : (
          item.getItemName()
        )}
      </div>
    </button>
  )
}

export default FileItem
