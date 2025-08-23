'use client'

import { useTree } from '@headless-tree/react'
import { createTreeConfig } from '@/features/file-explorer/lib/tree-config-utils'
import {
  ICON_SIZE_PX,
  INDENT_SIZE_PX,
} from '@/features/file-explorer/model/constants'
import type { FileNode } from '@/features/file-explorer/model/types'
import FileExplorerItem from '@/features/file-explorer/ui/file-explorer-item/file-explorer-item'
import { cn } from '@/shared/lib/utils'
import { mockFileTree } from '../../fixtures/mock-data'

interface FileExplorerPanelProps {
  fileTree?: Record<string, FileNode>
  rootItemId?: string
  indent?: number
}

/**
 * 파일 탐색기 패널 메인 컴포넌트
 */
export const FileExplorerPanel = ({
  fileTree = mockFileTree,
  rootItemId = '/',
  indent = INDENT_SIZE_PX,
}: FileExplorerPanelProps) => {
  const treeConfig = createTreeConfig({
    rootItemId,
    fileTree,
    indent,
  })
  const tree = useTree<FileNode>(treeConfig)

  const { className: treeClassName, ...restContainerProps } =
    tree.getContainerProps()

  return (
    <div {...restContainerProps} className={cn('flex flex-col', treeClassName)}>
      {tree.getItems().map(item => (
        <FileExplorerItem
          key={item.getId()}
          item={item}
          indent={indent}
          iconSize={ICON_SIZE_PX}
        />
      ))}
    </div>
  )
}

export default FileExplorerPanel
