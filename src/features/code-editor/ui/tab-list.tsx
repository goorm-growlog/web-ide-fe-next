import { useState } from 'react'
import type { TabListProps } from '../types'
import { TabItem } from './tab-item'
import styles from './tab-list.module.css'

/**
 * 파일 탭 리스트 컴포넌트
 */
export const TabList = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onTabCopyPath,
  onTabCloseOthers,
  onTabCloseToRight,
  onTabCloseAll,
  onTabReorder,
}: TabListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  if (!tabs || tabs.length === 0) {
    return null
  }

  const handleTabDragStart = (_tabId: string, index: number) => {
    setDraggedIndex(index)
  }

  const handleTabDragOver = (e: React.DragEvent, _index: number) => {
    e.preventDefault()
  }

  const handleTabDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onTabReorder(draggedIndex, dropIndex)
    }

    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="flex border-border border-b bg-background" role="tablist">
      {/* 탭 컨테이너 - 가로 스크롤 가능 (스크롤바 숨김) */}
      <div
        className={`flex min-w-0 flex-1 gap-0.5 overflow-x-auto px-2 py-1 ${styles.tabContainer}`}
        role="presentation"
      >
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            tab={{
              ...tab,
              isActive: tab.id === activeTabId,
            }}
            index={index}
            onTabClick={onTabClick}
            onTabClose={onTabClose}
            onTabCopyPath={onTabCopyPath}
            onTabCloseOthers={onTabCloseOthers}
            onTabCloseToRight={onTabCloseToRight}
            onTabCloseAll={onTabCloseAll}
            onTabDragStart={handleTabDragStart}
            onTabDragOver={handleTabDragOver}
            onTabDrop={handleTabDrop}
            onTabDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  )
}
