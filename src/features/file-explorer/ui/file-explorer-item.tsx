import type { ItemInstance } from '@headless-tree/core'
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react'
import type { FileNode } from './file-explorer'
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
  const isFocused = item.isFocused()

  return (
    <button
      {...item.getProps()}
      style={{ paddingLeft }}
      className={styles.item}
      role="treeitem"
      aria-expanded={isFolder ? isExpanded : undefined}
      aria-label={item.getItemName()}
      tabIndex={0}
      data-selected={isSelected ? '' : undefined}
      data-focused={isFocused ? '' : undefined}
    >
      <div className={styles.icons}>
        {renderIcon(isFolder, isExpanded, iconSize)}
      </div>
      <div className={styles.label}>{item.getItemName()}</div>
    </button>
  )
}

export default FileExplorerItem
