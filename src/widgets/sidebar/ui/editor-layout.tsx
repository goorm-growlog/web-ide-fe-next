'use client'

import { useParams } from 'next/navigation'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import type {
  ImperativePanelGroupHandle,
  ImperativePanelHandle,
} from 'react-resizable-panels'
import type { ChatReturn } from '@/features/chat/types/client'
import { ChatPanel } from '@/features/chat/ui/chat-panel'
import { useFileSystemIntegration } from '@/features/code-editor/hooks/use-file-system-integration'
import type { FileTab } from '@/features/code-editor/types'
import { CollaborativeMonacoEditor } from '@/features/code-editor/ui/collaborative-monaco-editor'
import { TabList } from '@/features/code-editor/ui/tab-list'
import type { FileTreeReturn } from '@/features/file-explorer/types/client'
import { copyToClipboard } from '@/shared/lib/clipboard-utils'
import PanelLayout from '@/shared/ui/panel-layout'
import { ResizableGrowHandle } from '@/shared/ui/resizable-grow-handle'
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@/shared/ui/shadcn/resizable'
import {
  DEFAULT_SIDEBAR_CONFIG,
  TAB_DEFINITIONS,
} from '@/widgets/sidebar/constants/config'
import { useActiveTab, usePosition } from '@/widgets/sidebar/model/hooks'
import { useSidebarStore } from '@/widgets/sidebar/model/store'
import TabSwitcher from '@/widgets/sidebar/ui/tab-switcher'
import TogglePanels from '@/widgets/sidebar/ui/toggle-panels'

// 패널 기본 사이즈 상수
const DEFAULT_PANEL_SIZE = 25
const MAIN_PANEL_SIZE = 50

interface EditorLayoutProps {
  projectId?: string
  fileTreeData: FileTreeReturn
  chatData: ChatReturn
  secondaryPanel: {
    isVisible: boolean
    onToggle: () => void
  }
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
    handleTabReorder,
    actualProjectId,
  }: {
    fileSystem: ReturnType<typeof useFileSystemIntegration>
    tabs: FileTab[]
    handleTabClick: (tabId: string) => void
    handleTabClose: (tabId: string) => void
    handleTabCopyPath: (tabId: string) => void
    handleTabCloseOthers: (tabId: string) => void
    handleTabCloseToRight: (tabId: string) => void
    handleTabCloseAll: () => void
    handleTabReorder: (dragIndex: number, dropIndex: number) => void
    actualProjectId: string | null
  }) => {
    const activeFile = fileSystem.getActiveFile()

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
        <TabList
          tabs={tabs}
          activeTabId={fileSystem.activeFileId}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onTabCopyPath={handleTabCopyPath}
          onTabCloseOthers={handleTabCloseOthers}
          onTabCloseToRight={handleTabCloseToRight}
          onTabCloseAll={handleTabCloseAll}
          onTabReorder={handleTabReorder}
        />

        <div className="flex-1">
          {activeFile ? (
            <CollaborativeMonacoEditor
              roomId={`project-${actualProjectId}-file-${activeFile.id}`}
              value={activeFile.content}
              language={activeFile.language}
              onChange={handleEditorChange}
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

const EditorLayout = memo((props: EditorLayoutProps) => {
  const { projectId, fileTreeData, chatData, secondaryPanel } = props
  const params = useParams()
  const actualProjectId = projectId || (params.projectId as string) || null

  const { position } = usePosition()
  const { activeTab, toggleTab } = useActiveTab()
  const { primarySize, secondarySize, setPrimarySize, setSecondarySize } =
    useSidebarStore()
  const isVisible = activeTab !== null
  const isPrimaryLeft = position === 'left'

  // 패널 크기 실시간 추적 (Zustand store 값으로 초기화)
  const [primaryLastSize, setPrimaryLastSize] = useState(
    primarySize || DEFAULT_PANEL_SIZE,
  )
  const [secondaryLastSize, setSecondaryLastSize] = useState(
    secondarySize || DEFAULT_PANEL_SIZE,
  )

  // 패널 refs
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null)
  const primaryPanelRef = useRef<ImperativePanelHandle>(null)
  const secondaryPanelRef = useRef<ImperativePanelHandle>(null)

  // 파일 시스템 연동
  const fileSystem = useFileSystemIntegration(actualProjectId || '')
  const tabs: FileTab[] = Object.values(fileSystem.files).map(file => ({
    id: file.id,
    name: file.name,
    path: file.path,
    isActive: file.id === fileSystem.activeFileId,
  }))

  // 탭 핸들러들
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

  const handleTabCopyPath = useCallback(
    (tabId: string) => {
      const file = fileSystem.files[tabId]
      if (file) copyToClipboard(file.path)
    },
    [fileSystem.files],
  )

  const handleTabCloseOthers = useCallback(
    (tabId: string) => {
      Object.keys(fileSystem.files)
        .filter(id => id !== tabId)
        .forEach(id => {
          fileSystem.closeFile(id)
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

  const handleTabReorder = useCallback(
    (dragIndex: number, dropIndex: number) => {
      fileSystem.reorderTabs(dragIndex, dropIndex)
    },
    [fileSystem],
  )

  // 레이아웃 변화 시 패널 크기 추적 및 저장 (Zustand store 사용)
  const handleLayoutChange = useCallback(
    (sizes: number[]) => {
      if (sizes.length >= 3) {
        // Primary 패널 크기 추적 및 저장 (패널이 열려있을 때만)
        if (isVisible && sizes[0] && sizes[0] > 0) {
          setPrimaryLastSize(sizes[0])
          setPrimarySize(sizes[0])
        }
        // Secondary 패널 크기 추적 및 저장 (패널이 열려있을 때만)
        if (secondaryPanel?.isVisible && sizes[2] && sizes[2] > 0) {
          setSecondaryLastSize(sizes[2])
          setSecondarySize(sizes[2])
        }

        // 패널이 0 크기가 되면 자동으로 collapse 처리
        if (secondaryPanel?.isVisible && sizes[2] === 0) {
          secondaryPanel.onToggle() // 상태를 false로 업데이트
        }
      }
    },
    [
      isVisible,
      secondaryPanel?.isVisible,
      secondaryPanel?.onToggle,
      setPrimarySize,
      setSecondarySize,
    ],
  )

  // 패널 상태 변화에 따른 실제 collapse/expand 처리
  useEffect(() => {
    if (!primaryPanelRef.current) return

    if (!isVisible) {
      // Primary 패널이 닫힐 때 현재 크기 저장 (0이면 기본값 저장)
      const currentSize = primaryPanelRef.current.getSize()
      const sizeToSave = currentSize > 0 ? currentSize : DEFAULT_PANEL_SIZE
      setPrimaryLastSize(sizeToSave)
      setPrimarySize(sizeToSave)
      primaryPanelRef.current.collapse()
    } else {
      // Primary 패널이 열릴 때 저장된 크기로 복원 (0이면 기본값)
      const targetSize =
        primaryLastSize > 0 ? primaryLastSize : DEFAULT_PANEL_SIZE
      primaryPanelRef.current.resize(targetSize)
    }
  }, [isVisible, primaryLastSize, setPrimarySize])

  useEffect(() => {
    if (!secondaryPanelRef.current) return

    if (!secondaryPanel?.isVisible) {
      // Secondary 패널이 닫힐 때 현재 크기 저장 (0이면 기본값 저장)
      const currentSize = secondaryPanelRef.current.getSize()
      const sizeToSave = currentSize > 0 ? currentSize : DEFAULT_PANEL_SIZE
      setSecondaryLastSize(sizeToSave)
      setSecondarySize(sizeToSave)
      secondaryPanelRef.current.collapse()
    } else {
      // Secondary 패널이 열릴 때 저장된 크기로 복원 (0이면 기본값)
      const targetSize =
        secondaryLastSize > 0 ? secondaryLastSize : DEFAULT_PANEL_SIZE
      secondaryPanelRef.current.resize(targetSize)
    }
  }, [secondaryPanel?.isVisible, secondaryLastSize, setSecondarySize])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-full w-full">
        {/* 왼쪽 고정 TabSwitcher */}
        {isPrimaryLeft && (
          <div className="w-12 flex-shrink-0 md:w-14 lg:w-16">
            <TabSwitcher
              tabs={TAB_DEFINITIONS}
              activeTabKey={activeTab}
              onTabClick={toggleTab}
              position="left"
              className="h-full"
            />
          </div>
        )}

        {/* 공식 문서 권장사항: 단순한 패널 구조 */}
        <ResizablePanelGroup
          ref={panelGroupRef}
          direction="horizontal"
          className="h-full flex-1"
          onLayout={handleLayoutChange}
        >
          {/* Primary 패널 - 단순한 구조 */}
          <ResizablePanel
            id="primary-panel"
            ref={primaryPanelRef}
            defaultSize={primarySize || DEFAULT_PANEL_SIZE}
            minSize={DEFAULT_SIDEBAR_CONFIG.primaryMinSize}
            maxSize={DEFAULT_SIDEBAR_CONFIG.maxSize}
            collapsible
            onCollapse={() => {
              toggleTab(null)
              // 실제로 패널 collapse
              if (primaryPanelRef.current) {
                primaryPanelRef.current.collapse()
              }
            }}
            onExpand={() => {
              const targetSize =
                primaryLastSize > 0 ? primaryLastSize : DEFAULT_PANEL_SIZE
              primaryPanelRef.current?.resize(targetSize)
            }}
          >
            <PanelLayout>
              <TogglePanels
                activeTabKey={activeTab}
                fileTreeData={fileTreeData}
                chatData={chatData}
                projectId={actualProjectId || ''}
                onFileOpen={fileSystem.openFileFromTree}
              />
            </PanelLayout>
          </ResizablePanel>

          {/* 핸들 - Primary 패널이 열려있을 때만 표시 */}
          {isVisible && <ResizableGrowHandle />}

          {/* 메인 패널 - 단순한 구조 */}
          <ResizablePanel
            id="main-panel"
            defaultSize={MAIN_PANEL_SIZE}
            minSize={30}
            className="flex flex-col"
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
                  handleTabReorder={handleTabReorder}
                  actualProjectId={actualProjectId}
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

          {/* 핸들 - Secondary 패널이 열려있을 때만 표시 */}
          {secondaryPanel.isVisible && <ResizableGrowHandle />}

          {/* 세컨더리 패널 - 단순한 구조 */}
          <ResizablePanel
            id="secondary-panel"
            ref={secondaryPanelRef}
            defaultSize={secondarySize || DEFAULT_PANEL_SIZE}
            minSize={DEFAULT_SIDEBAR_CONFIG.secondaryMinSize}
            maxSize={DEFAULT_SIDEBAR_CONFIG.maxSize}
            collapsible
            onCollapse={() => {
              // onCollapse에서는 토글하지 않음 (중복 방지)
              console.log('Secondary panel collapsed')
            }}
            onExpand={() => {
              const targetSize =
                secondaryLastSize > 0 ? secondaryLastSize : DEFAULT_PANEL_SIZE
              secondaryPanelRef.current?.resize(targetSize)
            }}
          >
            <PanelLayout>
              <ChatPanel chatData={chatData} />
            </PanelLayout>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* 오른쪽 고정 TabSwitcher */}
        {!isPrimaryLeft && (
          <div className="w-12 flex-shrink-0 md:w-14 lg:w-16">
            <TabSwitcher
              tabs={TAB_DEFINITIONS}
              activeTabKey={activeTab}
              onTabClick={toggleTab}
              position="right"
              className="h-full"
            />
          </div>
        )}
      </div>
    </div>
  )
})

EditorLayout.displayName = 'EditorLayout'

export default EditorLayout
