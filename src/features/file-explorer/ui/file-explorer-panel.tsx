'use client'

import useFileTree from '@/features/file-explorer/hooks/use-file-tree'
import FileExplorerItem from '@/features/file-explorer/ui/file-explorer-item'
import {
  ICON_SIZE_PX,
  INDENT_SIZE_PX,
  SCROLLABLE_PANEL_CONTENT_STYLES,
} from '@/shared/constants/ui'
import PanelLayout from '@/shared/ui/panel-layout'

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
    <PanelLayout className={treeClassName}>
      <div className={SCROLLABLE_PANEL_CONTENT_STYLES} {...restContainerProps}>
        {items.map(item => (
          <FileExplorerItem
            key={item.getId()}
            item={item}
            indent={indent}
            iconSize={ICON_SIZE_PX}
          />
        ))}
      </div>
    </PanelLayout>
  )
}

export default FileExplorerPanel
