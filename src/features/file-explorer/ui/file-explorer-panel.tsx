'use client'

import { useState } from 'react'
import { FILE_EXPLORER_TEXTS } from '@/features/file-explorer/constants/texts'
import { useFileOperations } from '@/features/file-explorer/hooks/use-file-operations'
import useFileTree from '@/features/file-explorer/hooks/use-file-tree'
import type {
  FileSystemItem,
  ItemType,
} from '@/features/file-explorer/model/types'
import { ContextActions } from '@/features/file-explorer/ui/context-actions'
import { CreateItemDialog } from '@/features/file-explorer/ui/create-item-dialog'
import FileItem from '@/features/file-explorer/ui/file-item'
import { FILE_SHORTCUTS } from '@/shared/constants/keyboard-shortcuts'
import {
  ICON_SIZE_PX,
  INDENT_SIZE_PX,
  SCROLLABLE_PANEL_CONTENT_STYLES,
} from '@/shared/constants/ui'
import { cn } from '@/shared/lib/utils'
import PanelLayout from '@/shared/ui/panel-layout'

/**
 * 파일 탐색기의 루트 아이템 ID
 * @default '/'
 */
interface FileExplorerPanelProps {
  rootId?: string
}

export const FileExplorerPanel = ({ rootId = '/' }: FileExplorerPanelProps) => {
  const indent = INDENT_SIZE_PX
  const { containerProps, items, tree } = useFileTree({ rootId, indent })
  const rootItem = tree.getRootItem()

  const fileOperations = useFileOperations()

  const [createDialog, setCreateDialog] = useState<{
    type: ItemType
    targetPath: string
  } | null>(null)

  const { className: treeClassName, ...restContainerProps } = containerProps

  const getTargetPath = (item: FileSystemItem) => {
    return item.isFolder() ? item.getId() : item.getParent()?.getId() || rootId
  }

  const openCreateDialog = (item: FileSystemItem, type: ItemType) => {
    if (item.isFolder()) item.expand()
    const targetPath = getTargetPath(item)
    setCreateDialog({ type, targetPath })
  }

  const handleCreateConfirm = (name: string) => {
    if (!createDialog) return

    const { type, targetPath } = createDialog
    if (type === 'file') {
      fileOperations.createFile(targetPath, name)
    } else {
      fileOperations.createFolder(targetPath, name)
    }

    setCreateDialog(null)
  }

  const handleCreateCancel = () => {
    setCreateDialog(null)
  }

  const renderItemContextMenu = (item: FileSystemItem) => {
    const isRoot = rootId === item.getId()

    return (
      <>
        <ContextActions.Create
          type="file"
          onTrigger={() => openCreateDialog(item, 'file')}
          shortcut={FILE_SHORTCUTS.NEW_FILE}
          label={FILE_EXPLORER_TEXTS.NEW_FILE}
        />
        <ContextActions.Create
          type="folder"
          onTrigger={() => openCreateDialog(item, 'folder')}
          shortcut={FILE_SHORTCUTS.NEW_FOLDER}
          label={FILE_EXPLORER_TEXTS.NEW_FOLDER}
        />
        <ContextActions.Separator />
        <ContextActions.Standard
          onTrigger={() => fileOperations.copyPath(item.getId())}
          shortcut={FILE_SHORTCUTS.COPY_PATH}
          label={FILE_EXPLORER_TEXTS.COPY_PATH}
        />
        {!isRoot && (
          <>
            <ContextActions.Separator />
            <ContextActions.Standard
              onTrigger={() => item.startRenaming()}
              shortcut={FILE_SHORTCUTS.RENAME}
              label={FILE_EXPLORER_TEXTS.RENAME}
            />
            <ContextActions.Destructive
              onTrigger={() => fileOperations.deleteItem(item.getId())}
              shortcut={FILE_SHORTCUTS.DELETE}
              label={FILE_EXPLORER_TEXTS.DELETE}
            />
          </>
        )}
      </>
    )
  }

  return (
    <PanelLayout className={treeClassName}>
      <div className={SCROLLABLE_PANEL_CONTENT_STYLES} {...restContainerProps}>
        {items.map(item => (
          <ContextActions.Root key={item.getId()}>
            <ContextActions.Trigger>
              <FileItem item={item} indent={indent} iconSize={ICON_SIZE_PX} />
            </ContextActions.Trigger>
            <ContextActions.Content>
              {renderItemContextMenu(item)}
            </ContextActions.Content>
          </ContextActions.Root>
        ))}
      </div>

      <ContextActions.Root>
        <ContextActions.Trigger>
          <div className={cn('h-full w-full flex-1')} />
        </ContextActions.Trigger>
        <ContextActions.Content>
          {renderItemContextMenu(rootItem)}
        </ContextActions.Content>
      </ContextActions.Root>

      {createDialog && (
        <CreateItemDialog
          isOpen={true}
          type={createDialog.type}
          defaultName={
            createDialog.type === 'file'
              ? FILE_EXPLORER_TEXTS.NEW_FILE_DEFAULT
              : FILE_EXPLORER_TEXTS.NEW_FOLDER_DEFAULT
          }
          onConfirm={handleCreateConfirm}
          onCancel={handleCreateCancel}
          title={
            createDialog.type === 'file'
              ? FILE_EXPLORER_TEXTS.NEW_FILE
              : FILE_EXPLORER_TEXTS.NEW_FOLDER
          }
          placeholder={
            createDialog.type === 'file'
              ? FILE_EXPLORER_TEXTS.FILE_PLACEHOLDER
              : FILE_EXPLORER_TEXTS.FOLDER_PLACEHOLDER
          }
        />
      )}
    </PanelLayout>
  )
}

export default FileExplorerPanel
