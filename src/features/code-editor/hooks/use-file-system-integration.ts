import { useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { authApi } from '@/shared/api/ky-client'
import { logger } from '@/shared/lib/logger'
import { getLanguageFromPath } from '../lib/language-detection'
import type { EditorFile } from '../types'
import { useFileEditor } from './use-file-editor'

/**
 * 파일 시스템 연동 훅
 * 기존 파일 API와 연동하여 파일 열기/저장 기능 제공
 */
export const useFileSystemIntegration = (projectId: string) => {
  const fileEditor = useFileEditor()
  const autoSaveTimeouts = useRef<Record<string, NodeJS.Timeout>>({})

  const openFileFromTree = useCallback(
    async (filePath: string) => {
      logger.info(`Opening file from tree: ${filePath}`)

      // 로딩 상태 설정
      fileEditor.setLoading(true)

      // 즉시 빈 탭 생성 (사용자가 즉시 탭을 볼 수 있음)
      const fileName = filePath.split('/').pop() || ''
      const tempFile: EditorFile = {
        id: filePath,
        name: fileName,
        path: filePath,
        content: '', // 빈 내용으로 시작
        language: getLanguageFromPath(filePath),
      }

      // 새 탭을 열고 활성화 (표준 IDE 동작)
      fileEditor.openFile(tempFile)
      logger.info(`New tab created for: ${filePath}`)

      // 백그라운드에서 파일 내용 로드
      try {
        const response = await authApi
          .get(`/api/projects/${projectId}/files`, {
            searchParams: { path: filePath },
          })
          .json<{ success: boolean; data: { content: string } }>()

        if (!response.success || !response.data) {
          throw new Error('Failed to fetch file content')
        }

        // 파일 내용 업데이트
        fileEditor.updateFileContent(filePath, response.data.content)
        logger.info(`File content loaded: ${filePath}`)
      } catch (error) {
        logger.error('Failed to load file content:', error)
        fileEditor.closeFile(filePath)
        toast.error(`Failed to open file: ${filePath}`)
      } finally {
        // 로딩 상태 해제
        fileEditor.setLoading(false)
      }
    },
    [fileEditor, projectId],
  )

  const saveFile = useCallback(
    async (fileId: string, silent = false) => {
      const file = fileEditor.files[fileId]
      if (!file) return

      try {
        // 파일 저장 (백엔드 API 스펙에 맞게 수정)
        await authApi.put(`/api/projects/${projectId}/files`, {
          json: {
            path: file.path,
            content: file.content,
          },
        })

        // 수동 저장일 때만 성공 토스트 표시
        if (!silent) {
          toast.success(`File saved: ${file.name}`)
        }
      } catch (error) {
        logger.error('Failed to save file:', error)
        toast.error(`Failed to save file: ${file.name}`)
      }
    },
    [fileEditor, projectId],
  )

  // 자동 저장 함수 (디바운스 적용)
  const autoSaveFile = useCallback(
    (fileId: string) => {
      if (autoSaveTimeouts.current[fileId]) {
        clearTimeout(autoSaveTimeouts.current[fileId])
      }

      autoSaveTimeouts.current[fileId] = setTimeout(async () => {
        try {
          await saveFile(fileId, true)
        } catch (error) {
          logger.error('Auto-save failed:', error)
          toast.error(`Auto-save failed. Please save manually.`)
        }
        delete autoSaveTimeouts.current[fileId]
      }, 2000)
    },
    [saveFile],
  )

  // 파일 내용 업데이트 시 자동 저장 스케줄링
  const updateFileContentWithAutoSave = useCallback(
    (fileId: string, content: string) => {
      // 파일 내용 업데이트
      fileEditor.updateFileContent(fileId, content)

      // 자동 저장 스케줄링
      autoSaveFile(fileId)
    },
    [fileEditor, autoSaveFile],
  )

  return {
    ...fileEditor,
    openFileFromTree,
    saveFile,
    updateFileContentWithAutoSave,
  }
}
