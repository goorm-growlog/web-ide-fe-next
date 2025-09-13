export type FileNodeType = 'file' | 'folder'

/**
 * 서버에서 받는 트리 노드 데이터 구조
 * @param id 노드의 고유 식별자
 * @param path 파일/폴더의 경로
 * @param type 노드 타입 (파일 또는 폴더)
 * @param children 자식 노드들 (폴더인 경우)
 */
export interface TreeNodeDto {
  id: number
  path: string
  type: FileNodeType
  children?: TreeNodeDto[] | null
}

/**
 * 트리 노드 추가 이벤트 페이로드
 * @param path 추가될 노드의 경로
 * @param type 추가될 노드의 타입
 */
export interface TreeAddPayload {
  path: string
  type: FileNodeType
}

/**
 * 트리 노드 제거 이벤트 페이로드
 * @param path 제거될 노드의 경로
 */
export interface TreeRemovePayload {
  path: string
}

/**
 * 트리 노드 이동 이벤트 페이로드
 * @param fromPath 이동할 노드의 원본 경로
 * @param toPath 이동할 노드의 대상 경로
 */
export interface TreeMovePayload {
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
 * 트리 초기화 메시지
 * @param type 메시지 타입
 * @param payload 초기화할 트리 노드 데이터
 */
export interface TreeInitMessage {
  type: 'tree:init'
  payload: TreeNodeDto[]
}

/**
 * 트리 노드 추가 메시지
 * @param type 메시지 타입
 * @param payload 추가할 노드 정보
 */
export interface TreeAddMessage {
  type: 'tree:add'
  payload: TreeAddPayload
}

/**
 * 트리 노드 제거 메시지
 * @param type 메시지 타입
 * @param payload 제거할 노드 정보
 */
export interface TreeRemoveMessage {
  type: 'tree:remove'
  payload: TreeRemovePayload
}

/**
 * 트리 노드 이동 메시지
 * @param type 메시지 타입
 * @param payload 이동할 노드 정보
 */
export interface TreeMoveMessage {
  type: 'tree:move'
  payload: TreeMovePayload
}

export type FileTreeMessage =
  | TreeInitMessage
  | TreeAddMessage
  | TreeRemoveMessage
  | TreeMoveMessage
