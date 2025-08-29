/**
 * 파일 노드 타입 정의
 *
 * 폴더: isFolder === true이고 children이 필수
 * 파일: isFolder === false (또는 생략)이고 children 없음
 */
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
