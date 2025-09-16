/**
 * 파일 트리 API 요청/응답 타입 정의 (개선된 버전)
 * TOSS 원칙: Standardizing Return Types - 일관된 반환 타입 사용
 */

import type { FileTreeError } from '@/shared/types/error'

// API 요청 타입
export interface CreateFileRequest {
  path: string
  type: 'file' | 'folder'
}

export interface MoveFileRequest {
  fromPath: string
  toPath: string
}

// API 응답 타입 (일관된 패턴)
export interface FileOperationResponse {
  message: string
}

// 파일 타입 정의
export type FileTreeNodeType = 'file' | 'folder'

// 에러 타입 정의 (통합됨)
export type FileTreeApiError = FileTreeError
