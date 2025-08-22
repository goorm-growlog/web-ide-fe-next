'use client'

import { useTree } from '@headless-tree/react'
import { mockFileTree } from '@/features/file-explorer/fixtures/mock-data'
import { createTreeConfig } from '@/features/file-explorer/lib/tree-config-utils'
import {
  ICON_SIZE,
  INDENT_SIZE,
} from '@/features/file-explorer/model/constants'
import type { FileNode } from '@/features/file-explorer/model/types'
import FileExplorerItem from '@/features/file-explorer/ui/file-explorer-item/file-explorer-item'
import { cn } from '@/shared/lib/utils'

/**
 * 파일 탐색기 패널 메인 컴포넌트
 */
export const FileExplorerPanel = () => {
  const treeConfig = createTreeConfig({
    rootItemId: '/',
    fileTree: mockFileTree,
    indent: INDENT_SIZE,
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
          indent={INDENT_SIZE}
          iconSize={ICON_SIZE}
        />
      ))}
    </div>
  )
}

export default FileExplorerPanel
