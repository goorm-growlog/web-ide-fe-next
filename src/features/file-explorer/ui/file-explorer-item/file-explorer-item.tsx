'use client'

import type { ItemInstance } from '@headless-tree/core'
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react'
import { useCallback, useMemo } from 'react'
import type { FileNode } from '@/features/file-explorer/model/types'
import { cn } from '@/shared/lib/utils'
import styles from './file-explorer-item.module.css'

interface FileExplorerItemProps {
  item: ItemInstance<FileNode>
  indent: number
  iconSize: number
}

const FileExplorerItem = ({
  item,
  indent,
  iconSize,
}: FileExplorerItemProps) => {
  const level = item.getItemMeta().level
  const isFolder = item.isFolder()
  const isExpanded = item.isExpanded()
  const isSelected = item.isSelected()
  const isFocused = item.isFocused()

  const paddingLeft = useMemo(
    () => level * indent + iconSize,
    [level, indent, iconSize],
  )

  const isDropZone = useCallback(
    (itemInstance: ItemInstance<FileNode>): boolean => {
      const isDragTarget = itemInstance.isDragTarget()
      const isSelected = itemInstance.isSelected()

      const dragTarget = itemInstance.getTree().getDragTarget()
      const isDescendantOfDragTarget =
        dragTarget?.item != null &&
        itemInstance.isDescendentOf(dragTarget.item.getId())

      return isDragTarget || (!isSelected && isDescendantOfDragTarget)
    },
    [],
  )

  const iconElement = useMemo(() => {
    if (isFolder) {
      return (
        <>
          <ChevronRightIcon
            data-state={isExpanded ? 'open' : 'closed'}
            className={styles.chevron}
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
        <span style={{ paddingLeft: iconSize }} />
        <FileIcon size={iconSize} />
      </>
    )
  }, [isFolder, isExpanded, iconSize])

  return (
    <button
      type="button"
      {...(() => {
        const props = item.getProps()
        const { className: itemClassName, ...restProps } = props
        return {
          ...restProps,
          className: cn(
            styles.item,
            isDropZone(item) && styles.dropZone,
            itemClassName,
          ),
        }
      })()}
      style={{ paddingLeft }}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
    >
      <div className={styles.icons}>{iconElement}</div>
      <div className={styles.label}>
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

export default FileExplorerItem
