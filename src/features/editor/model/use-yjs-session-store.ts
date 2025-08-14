// src/stores/useYjsSessionStore.ts

import type { HocuspocusProvider } from '@hocuspocus/provider'
import { loader } from '@monaco-editor/react'
import type * as monaco from 'monaco-editor'
import type { MonacoBinding } from 'y-monaco'
import type * as Y from 'yjs'
import { create } from 'zustand'
import type { FileMetadata } from '@/shared/types/types'
import type { UserInfo } from '@/shared/types/user'
import { getLanguageFromFile } from '../lib/utils/get-language-from-file'
import { websocketPool } from './websocket-pool'

export interface YjsSession {
  yDoc: Y.Doc
  yProvider: HocuspocusProvider
  filePath: string
  textModel: monaco.editor.ITextModel
  binding: MonacoBinding | null
}

interface YjsSessionStoreState {
  sessions: Map<string, YjsSession>
  getSession: (fileId: string) => YjsSession | null
  openSession: (
    projectId: string,
    metadata: FileMetadata,
    userInfo: UserInfo,
  ) => void
  closeSession: (fileId: string) => void
  connectEditorToSession: (
    fileId: string,
    editor: monaco.editor.IStandaloneCodeEditor,
  ) => void
  disconnectEditorFromSession: (
    fileId: string,
    editor: monaco.editor.IStandaloneCodeEditor,
  ) => void
}

// 세션 생성 중인 파일들을 추적하는 Set (경쟁 조건 방지)
const openingSession = new Set<string>()

export const useYjsSessionStore = create<YjsSessionStoreState>((set, get) => ({
  sessions: new Map(),

  getSession: fileId => get().sessions.get(fileId) || null,

  openSession: async (projectId, metadata, userInfo) => {
    const { id: fileId, filepath: filePath } = metadata

    // 이미 세션이 존재하거나 생성 중인 경우 중복 방지
    if (get().sessions.has(fileId)) {
      return
    }

    if (openingSession.has(fileId)) {
      return
    }

    // 세션 생성 시작 마킹
    openingSession.add(fileId)

    try {
      const monacoInstance = await loader.init()
      const { yDoc, yProvider } = websocketPool.getFileDocument(
        projectId,
        fileId,
        userInfo,
        // 서버 동기화 완료 후 Monaco 모델 업데이트 콜백
        syncedYDoc => {
          const sessions = get().sessions
          const session = sessions.get(fileId)
          if (session) {
            const syncedContent = syncedYDoc.getText('monaco').toString()
            if (session.textModel.getValue() !== syncedContent) {
              session.textModel.setValue(syncedContent)
            }
          }
        },
      )

      const modelUri = monacoInstance.Uri.parse(`inmemory://model/${fileId}`)
      let textModel = monacoInstance.editor.getModel(modelUri)
      const yText = yDoc.getText('monaco')
      const existingContent = yText.toString()

      if (!textModel || textModel.isDisposed()) {
        // 새 Monaco 모델 생성 (Y.Doc 내용 사용)
        textModel = monacoInstance.editor.createModel(
          existingContent,
          getLanguageFromFile(filePath),
          modelUri,
        )
      } else {
        //핵심 수정: 기존 모델이 있어도 Y.Doc 내용으로 동기화
        if (textModel.getValue() !== existingContent) {
          textModel.setValue(existingContent)
        }
      }

      set(state => ({
        sessions: new Map(state.sessions).set(fileId, {
          yDoc,
          yProvider,
          filePath,
          textModel,
          binding: null, // 바인딩은 나중에 에디터 연결 시 생성
        }),
      }))

      // 세션 생성 완료 마킹 해제
      openingSession.delete(fileId)
    } catch {
      // 에러 발생 시에도 마킹 해제
      openingSession.delete(fileId)
    }
  },

  closeSession: fileId => {
    set(state => {
      const sessions = new Map(state.sessions)
      const session = sessions.get(fileId)
      if (!session) return state

      // MonacoBinding 안전하게 정리
      session.binding?.destroy()

      // 텍스트 모델이 아직 dispose되지 않았다면 dispose
      if (!session.textModel.isDisposed()) {
        session.textModel.dispose()
      }

      //핵심 변경: 탭 닫기 시 Y.Doc도 완전 정리 (데이터 동기화 문제 해결)
      websocketPool.closeFileDocument(fileId)

      // UI 세션 맵에서도 제거
      sessions.delete(fileId)

      return { sessions }
    })
  },

  connectEditorToSession: async (fileId, editor) => {
    const session = get().sessions.get(fileId)
    if (!session) {
      return
    }

    //MonacoBinding을 에디터가 있을 때 생성
    if (!session.binding) {
      try {
        const { MonacoBinding } = await import('y-monaco')
        const yTextForBinding = session.yDoc.getText('monaco')

        //핵심: 에디터를 포함한 세트로 바인딩 생성 (remote selection을 위해 필수)
        const binding = new MonacoBinding(
          yTextForBinding,
          session.textModel,
          new Set([editor]),
          session.yProvider.awareness,
        )

        session.binding = binding
      } catch {
        // MonacoBinding creation failed
        return
      }
    } else {
      // 기존 바인딩에 에디터 추가
      session.binding.editors.add(editor)
    }
  },

  disconnectEditorFromSession: (fileId, editor) => {
    const session = get().sessions.get(fileId)
    if (!session) return

    // 에디터를 바인딩에서 안전하게 제거
    session.binding?.editors?.delete(editor)
  },
}))
