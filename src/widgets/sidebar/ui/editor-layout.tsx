'use client'

import type { editor } from 'monaco-editor'
import { useParams } from 'next/navigation'
import { memo, useCallback } from 'react'
import type { ChatReturn } from '@/features/chat/types/client'
import { ChatPanel } from '@/features/chat/ui/chat-panel'
import { useFileSystemIntegration } from '@/features/code-editor/hooks/use-file-system-integration'
import type { FileTab } from '@/features/code-editor/types'
import { MonacoEditor } from '@/features/code-editor/ui/monaco-editor'
import { TabList } from '@/features/code-editor/ui/tab-list'
import type { FileTreeReturn } from '@/features/file-explorer/types/client'
import { copyToClipboard } from '@/shared/lib/clipboard-utils'
import { cn } from '@/shared/lib/utils'
import PanelLayout from '@/shared/ui/panel-layout'
import { ResizableGrowHandle } from '@/shared/ui/resizable-grow-handle'
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/ui/shadcn/resizable'
import { DEFAULT_SIDEBAR_CONFIG } from '@/widgets/sidebar/constants/config'
import {
  useActiveTab,
  useLayout,
  useLayoutIndices,
  usePosition,
} from '@/widgets/sidebar/model/hooks'
import PrimarySidebar from '@/widgets/sidebar/ui/primary-sidebar'

interface EditorLayoutProps {
  projectId?: string
  fileTreeData: FileTreeReturn
  chatData: ChatReturn
}

// 메인 에디터 영역 컴포넌트
const MainEditorArea = memo(
  ({
    fileSystem,
    tabs,
    handleTabClick,
    handleTabClose,
    handleTabCopyPath,
    handleTabCloseOthers,
    handleTabCloseToRight,
    handleTabCloseAll,
  }: {
    fileSystem: ReturnType<typeof useFileSystemIntegration>
    tabs: FileTab[]
    handleTabClick: (tabId: string) => void
    handleTabClose: (tabId: string) => void
    handleTabCopyPath: (tabId: string) => void
    handleTabCloseOthers: (tabId: string) => void
    handleTabCloseToRight: (tabId: string) => void
    handleTabCloseAll: () => void
  }) => {
    const activeFile = fileSystem.getActiveFile()

    const handleEditorMount = useCallback(
      (
        editor: editor.IStandaloneCodeEditor,
        monaco: typeof import('monaco-editor'),
      ) => {
        // Monaco Editor 키보드 단축키 설정
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyW, () => {
          if (activeFile) {
            handleTabClose(activeFile.id)
          }
        })

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Tab, () => {
          // 다음 탭으로 이동
          const tabIds = Object.keys(fileSystem.files)
          const currentIndex = tabIds.indexOf(activeFile?.id || '')
          const nextIndex = (currentIndex + 1) % tabIds.length
          if (tabIds[nextIndex]) {
            handleTabClick(tabIds[nextIndex])
          }
        })

        editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Tab,
          () => {
            // 이전 탭으로 이동
            const tabIds = Object.keys(fileSystem.files)
            const currentIndex = tabIds.indexOf(activeFile?.id || '')
            const prevIndex =
              currentIndex === 0 ? tabIds.length - 1 : currentIndex - 1
            if (tabIds[prevIndex]) {
              handleTabClick(tabIds[prevIndex])
            }
          },
        )
      },
      [activeFile, fileSystem.files, handleTabClose, handleTabClick],
    )

    const handleEditorChange = useCallback(
      (value: string | undefined) => {
        if (activeFile && value !== undefined) {
          fileSystem.updateFileContentWithAutoSave(activeFile.id, value)
        }
      },
      [activeFile, fileSystem],
    )

    return (
      <div className="flex h-full flex-col">
        {/* 탭 리스트 */}
        <TabList
          tabs={tabs}
          activeTabId={fileSystem.activeFileId}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onTabCopyPath={handleTabCopyPath}
          onTabCloseOthers={handleTabCloseOthers}
          onTabCloseToRight={handleTabCloseToRight}
          onTabCloseAll={handleTabCloseAll}
        />

        {/* 에디터 영역 */}
        <div className="flex-1">
          {activeFile ? (
            <MonacoEditor
              value={activeFile.content}
              language={activeFile.language}
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              height="100%"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <h2 className="mb-2 font-semibold text-lg">No file open</h2>
                <p className="text-muted-foreground text-sm">
                  Select a file from the file explorer to start editing.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  },
)

MainEditorArea.displayName = 'MainEditorArea'

const EditorLayout = memo(
  ({ projectId, fileTreeData, chatData }: EditorLayoutProps) => {
    const params = useParams()
    const actualProjectId = projectId || (params.projectId as string) || null
    const sidebarConfig = DEFAULT_SIDEBAR_CONFIG

    const { layout, setLayout } = useLayout()
    const { position } = usePosition()
    const { primary, secondary, main } = useLayoutIndices()

    const { activeTab, toggleTab } = useActiveTab()
    const isVisible = activeTab !== null
    const isPrimaryLeft = position === 'left'
    const primaryPosition = isPrimaryLeft ? 'left' : 'right'

    // 파일 시스템 연동 및 탭 관리
    const fileSystem = useFileSystemIntegration(actualProjectId || '')

    // 파일 시스템에서 직접 탭 데이터 생성
    const tabs: FileTab[] = Object.values(fileSystem.files).map(file => ({
      id: file.id,
      name: file.name,
      path: file.path,
      isActive: file.id === fileSystem.activeFileId,
    }))

    const handleTabClick = useCallback(
      (tabId: string) => {
        fileSystem.setActiveFileId(tabId)
      },
      [fileSystem],
    )

    const handleTabClose = useCallback(
      (tabId: string) => {
        fileSystem.closeFile(tabId)
      },
      [fileSystem],
    )

    const handleLayoutChange = (sizes: number[]) => setLayout(sizes)

    // 탭 컨텍스트 메뉴 핸들러들
    const handleTabCopyPath = useCallback(
      (tabId: string) => {
        const file = fileSystem.files[tabId]
        if (file) {
          copyToClipboard(file.path)
        }
      },
      [fileSystem.files],
    )

    const handleTabCloseOthers = useCallback(
      (tabId: string) => {
        Object.keys(fileSystem.files).forEach(id => {
          if (id !== tabId) {
            fileSystem.closeFile(id)
          }
        })
      },
      [fileSystem],
    )

    const handleTabCloseToRight = useCallback(
      (tabId: string) => {
        const tabIds = Object.keys(fileSystem.files)
        const currentIndex = tabIds.indexOf(tabId)
        if (currentIndex !== -1) {
          tabIds.slice(currentIndex + 1).forEach(id => {
            fileSystem.closeFile(id)
          })
        }
      },
      [fileSystem],
    )

    const handleTabCloseAll = useCallback(() => {
      Object.keys(fileSystem.files).forEach(id => {
        fileSystem.closeFile(id)
      })
    }, [fileSystem])

    const primaryPanel = (
      <ResizablePanel
        defaultSize={isVisible ? (layout[primary] ?? 25) : 16}
        maxSize={sidebarConfig.maxSize}
        minSize={sidebarConfig.primaryMinSize}
        order={primary}
        collapsible
        onCollapse={() => {
          const newLayout = [...layout]
          newLayout[primary] = 0
          setLayout(newLayout)
        }}
        onExpand={() => {
          const newLayout = [...layout]
          newLayout[primary] = 25
          setLayout(newLayout)
        }}
      >
        <PanelLayout>
          <PrimarySidebar
            position={primaryPosition}
            activeTab={activeTab}
            toggleTab={toggleTab}
            fileTreeData={fileTreeData}
            chatData={chatData}
            projectId={actualProjectId || ''}
            onFileOpen={fileSystem.openFileFromTree}
          />
        </PanelLayout>
      </ResizablePanel>
    )

    const mainPanel = (
      <ResizablePanel
        defaultSize={layout[main] ?? 50}
        minSize={30}
        order={main}
        className={cn('flex flex-col')}
      >
        <main className="flex h-full flex-col">
          {actualProjectId ? (
            <MainEditorArea
              fileSystem={fileSystem}
              tabs={tabs}
              handleTabClick={handleTabClick}
              handleTabClose={handleTabClose}
              handleTabCopyPath={handleTabCopyPath}
              handleTabCloseOthers={handleTabCloseOthers}
              handleTabCloseToRight={handleTabCloseToRight}
              handleTabCloseAll={handleTabCloseAll}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <h2 className="mb-2 font-semibold text-lg">
                  No project selected
                </h2>
                <p className="text-muted-foreground text-sm">
                  Please select a project to start editing.
                </p>
              </div>
            </div>
          )}
        </main>
      </ResizablePanel>
    )

    const secondaryPanel = (
      <ResizablePanel
        defaultSize={isVisible ? (layout[secondary] ?? 25) : 0}
        maxSize={sidebarConfig.maxSize}
        minSize={0}
        order={secondary}
        collapsible
        onCollapse={() => {
          const newLayout = [...layout]
          newLayout[secondary] = 0
          setLayout(newLayout)
        }}
        onExpand={() => {
          const newLayout = [...layout]
          newLayout[secondary] = 25
          setLayout(newLayout)
        }}
      >
        <PanelLayout>
          <ChatPanel chatData={chatData} />
        </PanelLayout>
      </ResizablePanel>
    )

    return (
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={handleLayoutChange}
        className="h-full min-h-0 w-full items-stretch"
      >
        {isPrimaryLeft && primaryPanel}
        <ResizableGrowHandle />
        {mainPanel}
        <ResizableGrowHandle />
        {!isPrimaryLeft && primaryPanel}
        {secondaryPanel}
      </ResizablePanelGroup>
    )
  },
)

export default EditorLayout
