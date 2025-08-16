import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { ICON_SIZE, INDENT_SIZE } from '../model/constants'
import { handleDrop } from '../model/drop-handler'
import { mockFileTree } from '../model/mock-data'
import type { FileNode } from '../model/types'
import styles from './file-explorer.module.css'
import FileExplorerItem from './file-explorer-item'

interface FileExplorerProps {
  rootItemId?: string
  fileTree?: Record<string, FileNode>
}

const FileExplorer = ({
  rootItemId = '/',
  fileTree = mockFileTree,
}: FileExplorerProps) => {
  const syncDataLoader = {
    getItem: (itemId: string) => fileTree[itemId] ?? { name: itemId },
    getChildren: (itemId: string) => fileTree[itemId]?.children ?? [],
  }

  const tree = useTree<FileNode>({
    rootItemId,
    getItemName: item => item.getItemData().name,
    isItemFolder: item => Boolean(item.getItemData().isFolder),
    dataLoader: syncDataLoader,
    indent: INDENT_SIZE,
    canDrop: (_, target) => target.item.isFolder(),
    onDrop: handleDrop,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
    ],
  })

  return (
    <div {...tree.getContainerProps()} className={styles.container}>
      {tree.getItems().map(item => (
        <FileExplorerItem
          key={item.getId()}
          item={item}
          indent={INDENT_SIZE}
          iconSize={ICON_SIZE}
        />
      ))}
    </div>
  )
}

export default FileExplorer
