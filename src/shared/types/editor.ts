import type { HocuspocusProvider } from '@hocuspocus/provider'
import type { editor as MonacoEditor } from 'monaco-editor'
import type { MonacoBinding } from 'y-monaco'
import type { Doc } from 'yjs'

//유저의 정보를 담을 어웨어니스
interface AwarenessUser {
  name: string
  color: string
  email?: string
}

// 파일 경로(filePath)별로 관리될 세션 데이터의 구조
interface EditorSession {
  yDoc: Doc
  yProvider: HocuspocusProvider
  textModel: MonacoEditor.ITextModel
  binding: MonacoBinding
}

export type { AwarenessUser, EditorSession }
