// src/components/FileSelector.tsx
'use client'

import { mockFiles } from '@/shared/data/mock-file-tree'
import { useEditorTabsStore } from '../model/use-panes-store'

interface FileSelectorProps {
  projectId: string
}

const FileSelector = ({ projectId }: FileSelectorProps) => {
  const { closeTab, openedFileIds, activeFileId, setActiveFileId } =
    useEditorTabsStore()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.3125rem',
        borderBottom: '1px solid #333',
        backgroundColor: '#252526',
        flexWrap: 'wrap',
      }}
    >
      {/* 열려있는 탭 목록 */}
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {openedFileIds.map(fileId => {
          const file = mockFiles.find(f => f.id === fileId)
          if (!file) return null
          const isActive = fileId === activeFileId
          return (
            <div
              key={fileId}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRight: '1px solid #333',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveFileId(fileId, projectId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: isActive ? '#1e1e1e' : 'transparent',
                  cursor: 'pointer',
                  color: isActive ? 'white' : '#999',
                  border: 'none',
                  flexGrow: 1,
                }}
              >
                <span>{file.name}</span>
              </button>
              <button
                type="button"
                onClick={() => closeTab(fileId)}
                style={{
                  marginLeft: '0.25rem',
                  marginRight: '0.5rem',
                  border: 'none',
                  background: 'transparent',
                  color: '#999',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  fontSize: '0.875rem',
                  minWidth: '1rem',
                }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { FileSelector }
