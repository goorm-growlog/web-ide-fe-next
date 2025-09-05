export interface FolderNode {
  name: string
  isFolder: true
  children: string[]
}

export interface FileItemNode {
  name: string
  isFolder?: false
  children?: never
}

export type FileNode = FolderNode | FileItemNode

export type ItemType = 'file' | 'folder'

export type FileActionType =
  | 'newFile'
  | 'newFolder'
  | 'copyPath'
  | 'delete'
  | 'rename'
