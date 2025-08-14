'use client'

import dynamic from 'next/dynamic'
import { FileSelector } from '@/features/editor/CollaborativeEditor/file-selector'
import { useEditorTabsStore } from '@/features/editor/model/use-panes-store'
import { useUserStore } from '@/features/editor/model/user-store'
import { mockFiles } from '@/shared/data/mock-file-tree'

const CollaborativeEditorWithNoSSR = dynamic(
  () =>
    import('@/features/editor/ui/collaborative-editor').then(
      mod => mod.CollaborativeEditor,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <p>에디터 로딩 중...</p>
      </div>
    ),
  },
)

interface ProjectEditorWidgetProps {
  projectId: string
}

export const ProjectEditorWidget = ({
  projectId,
}: ProjectEditorWidgetProps) => {
  const { activeFileId, openFileInEditor } = useEditorTabsStore()
  const { ensureUserInfo } = useUserStore()

  // 프로젝트 페이지 진입 시 사용자 초기화
  const _userInfo = ensureUserInfo()

  const FileTree = () => (
    <div
      style={{
        width: '200px',
        padding: '10px',
        borderRight: '1px solid #333',
        background: '#252526',
        color: 'white',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: '10px' }}>Files</h3>
      {mockFiles.map(file => (
        <button
          type="button"
          key={file.id}
          onClick={() => openFileInEditor(file, projectId)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            background: 'transparent',
            border: 'none',
            color: 'white',
            padding: '5px',
            cursor: 'pointer',
            borderRadius: '3px',
            marginBottom: '2px',
          }}
        >
          {file.name}
        </button>
      ))}
    </div>
  )

  const renderEditorContent = () => {
    if (!activeFileId) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <p>편집할 파일을 선택하세요.</p>
        </div>
      )
    }

    return <CollaborativeEditorWithNoSSR projectId={projectId} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <FileSelector projectId={projectId} />
      <div
        style={{ display: 'flex', flexGrow: 1, height: 'calc(100% - 41px)' }}
      >
        <FileTree />
        <div style={{ flex: 1, height: '100%', width: '100%' }}>
          {renderEditorContent()}
        </div>
      </div>
    </div>
  )
}
