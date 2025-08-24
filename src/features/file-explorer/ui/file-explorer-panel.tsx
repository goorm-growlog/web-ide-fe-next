'use client'

import useFileTree from '@/features/file-explorer/hooks/use-file-tree'
import FileExplorerItem from '@/features/file-explorer/ui/file-explorer-item'
import { ICON_SIZE_PX, INDENT_SIZE_PX } from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'

interface FileExplorerPanelProps {
  rootItemId?: string
}

export const FileExplorerPanel = ({
  rootItemId = '/',
}: FileExplorerPanelProps) => {
  const indent = INDENT_SIZE_PX
  const { containerProps, items } = useFileTree({ rootItemId, indent })
  const { className: treeClassName, ...restContainerProps } = containerProps

  return (
    <div {...restContainerProps} className={cn('flex flex-col', treeClassName)}>
      {items.map(item => (
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
