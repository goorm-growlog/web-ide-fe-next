'use client'

import type { ItemInstance } from '@headless-tree/core'
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import { isItemDropZone } from '@/features/file-explorer/lib/drop-zone-utils'
import type { FileNode } from '@/features/file-explorer/model/types'
import { INDENT_SIZE_PX } from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'

interface FileItemProps {
  item: ItemInstance<FileNode>
  iconSize: number
}

const FileItem = ({ item, iconSize }: FileItemProps) => {
  const level = item.getItemMeta().level
  const isFolder = item.isFolder()
  const isExpanded = item.isExpanded()
  const isSelected = item.isSelected()
  const isFocused = item.isFocused()

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
        <div style={{ width: `${iconSize}px` }} />
        <FileIcon size={iconSize} />
      </>
    )
  }, [isFolder, isExpanded, iconSize])

  const itemProps = item.getProps()
  const { className: itemClassName, ...restProps } = itemProps

  return (
    <button
      type="button"
      {...restProps}
      className={cn(
        itemClassName,
        isItemDropZone(item) && 'bg-blue-50',
        // 기본 스타일
        'flex w-full cursor-pointer items-center gap-1 py-1',
        'transition-colors duration-150 ease-in-out',
        // 키보드 접근성
        'focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-inset',
        // 상태별 스타일 (우선순위: selected > focused > hover)
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
