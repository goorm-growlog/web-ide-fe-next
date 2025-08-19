import type { DragTarget, ItemInstance } from '@headless-tree/core'
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react'
import type { FileNode } from '@/features/file-explorer/model/types'
import { cn } from '@/shared/lib/utils'
import styles from './file-explorer-item.module.css'

interface FileExplorerItemProps {
  item: ItemInstance<FileNode>
  indent: number
  iconSize: number
}

const renderIcon = (
  isFolder: boolean,
  isExpanded: boolean,
  iconSize: number,
) => {
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
}

const isDropZone = ({
  item,
  isDragTarget,
  isSelected,
  dragTarget,
}: {
  item: ItemInstance<FileNode>
  isDragTarget: boolean
  isSelected: boolean
  dragTarget: DragTarget<FileNode> | null
}) => {
  if (isDragTarget) return true
  if (isSelected) return false
  if (!dragTarget) return false

  return item.isDescendentOf(dragTarget.item.getId())
}

const FileExplorerItem = ({
  item,
  indent,
  iconSize,
}: FileExplorerItemProps) => {
  const level = item.getItemMeta().level
  const paddingLeft = level * indent + iconSize

  const isFolder = item.isFolder()
  const isExpanded = item.isExpanded()
  const isSelected = item.isSelected()
  const dragTarget = item.getTree().getDragTarget()
  const isDragTarget = item.isDragTarget()

  return (
    <button
      {...item.getProps()}
      style={{ paddingLeft }}
      className={cn(
        styles.item,
        isDropZone({
          item,
          isDragTarget,
          isSelected,
          dragTarget,
        }) && styles.dropZone,
      )}
    >
      <div className={styles.icons}>
        {renderIcon(isFolder, isExpanded, iconSize)}
      </div>
      <div className={styles.label}>{item.getItemName()}</div>
    </button>
  )
}

export default FileExplorerItem
