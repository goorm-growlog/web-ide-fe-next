/**
 * 파일 트리 API 타입 정의 (통합됨)
 * entities/file-tree/api/types.ts의 타입을 재사용
 */
import type { FileTreeNodeType } from '@/entities/file-tree/api/types'

/**
 * 서버에서 받는 파일 트리 노드 데이터 구조
 * @param path 파일/폴더의 경로
 * @param type 노드 타입 (파일 또는 폴더)
 * @param children 자식 노드들 (폴더인 경우)
 */
export interface FileTreeNodeDto {
  path: string
  type: FileTreeNodeType
  children?: FileTreeNodeDto[] | null
}

/**
 * 파일 트리 노드 추가 이벤트 페이로드
 * @param path 추가될 노드의 경로
 * @param type 추가될 노드의 타입
 */
export interface FileTreeAddPayload {
  path: string
  type: FileTreeNodeType
}

/**
 * 파일 트리 노드 제거 이벤트 페이로드
 * @param path 제거될 노드의 경로
 */
export interface FileTreeRemovePayload {
  path: string
}

/**
 * 파일 트리 노드 이동 이벤트 페이로드
 * @param fromPath 이동할 노드의 원본 경로
 * @param toPath 이동할 노드의 대상 경로
 */
export interface FileTreeMovePayload {
  fromPath: string
  toPath: string
}

export const FILE_TREE_MESSAGE_TYPES = {
  TREE_INIT: 'tree:init',
  TREE_ADD: 'tree:add',
  TREE_REMOVE: 'tree:remove',
  TREE_MOVE: 'tree:move',
} as const

export type FileTreeMessageType =
  (typeof FILE_TREE_MESSAGE_TYPES)[keyof typeof FILE_TREE_MESSAGE_TYPES]

/**
 * 파일 트리 초기화 서버 메시지
 * @param type 메시지 타입
 * @param payload 초기화할 트리 노드 데이터
 */
export interface FileTreeInitServerMessage {
  type: 'tree:init'
  payload: FileTreeNodeDto[]
}

/**
 * 파일 트리 노드 추가 서버 메시지
 * @param type 메시지 타입
 * @param payload 추가할 노드 정보
 */
export interface FileTreeAddServerMessage {
  type: 'tree:add'
  payload: FileTreeAddPayload
}

/**
 * 파일 트리 노드 제거 서버 메시지
 * @param type 메시지 타입
 * @param payload 제거할 노드 정보
 */
export interface FileTreeRemoveServerMessage {
  type: 'tree:remove'
  payload: FileTreeRemovePayload
}

/**
 * 파일 트리 노드 이동 서버 메시지
 * @param type 메시지 타입
 * @param payload 이동할 노드 정보
 */
export interface FileTreeMoveServerMessage {
  type: 'tree:move'
  payload: FileTreeMovePayload
}

export type FileTreeServerMessage =
  | FileTreeInitServerMessage
  | FileTreeAddServerMessage
  | FileTreeRemoveServerMessage
  | FileTreeMoveServerMessage
