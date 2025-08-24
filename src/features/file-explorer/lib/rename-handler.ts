import type { ItemInstance } from '@headless-tree/core'
import type { FileNode } from '../model/types'

// TODO: API
export const handleRename = (item: ItemInstance<FileNode>, value: string) => {
  const trimmedValue = value.trim()
  if (trimmedValue === '' || trimmedValue === item.getItemData().name) return

  try {
    item.getItemData().name = trimmedValue
    console.debug('Renamed item: {} => {}', item.getItemName, trimmedValue)
  } catch (error) {
    console.error('Rename operation failed:', error)
  }
}
