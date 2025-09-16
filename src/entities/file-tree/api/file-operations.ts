import { apiHelpers, authApi } from '@/shared/api/ky-client'
import { FILE_TREE_ENDPOINTS } from './constants'
import type {
  CreateFileRequest,
  FileOperationResponse,
  MoveFileRequest,
} from './types'

export const createFile = async (
  projectId: string,
  data: CreateFileRequest,
): Promise<FileOperationResponse> => {
  const response = await authApi
    .post(FILE_TREE_ENDPOINTS.CREATE_FILE(Number(projectId)), { json: data })
    .json<{
      success: boolean
      data: FileOperationResponse
      error: string | null
    }>()

  const result = apiHelpers.extractData(response)

  return result
}

export const deleteFile = async (
  projectId: string,
  fileId: string,
): Promise<FileOperationResponse> => {
  const response = await authApi
    .delete(FILE_TREE_ENDPOINTS.DELETE_FILE(Number(projectId)), {
      searchParams: { path: fileId },
    })
    .json<{
      success: boolean
      data: FileOperationResponse
      error: string | null
    }>()

  const result = apiHelpers.extractData(response)

  return result
}

export const moveFile = async (
  projectId: string,
  data: MoveFileRequest,
): Promise<FileOperationResponse> => {
  const response = await authApi
    .patch(FILE_TREE_ENDPOINTS.MOVE_FILE(Number(projectId)), {
      searchParams: {
        fromPath: data.fromPath,
        toPath: data.toPath,
      },
    })
    .json<{
      success: boolean
      data: FileOperationResponse
      error: string | null
    }>()

  const result = apiHelpers.extractData(response)

  return result
}
