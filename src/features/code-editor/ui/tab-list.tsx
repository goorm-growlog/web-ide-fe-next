import type { TabListProps } from '../types'
import { TabItem } from './tab-item'

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
}: TabListProps) => {
  if (!tabs || tabs.length === 0) {
    return null
  }

  return (
    <div className="flex border-border border-b bg-background">
      {/* 탭 컨테이너 - 가로 스크롤 가능 */}
      <div className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent flex min-w-0 flex-1 gap-0.5 overflow-x-auto px-2 py-1">
        {tabs.map((tab, _index) => (
          <TabItem
            key={tab.id}
            tab={{
              ...tab,
              isActive: tab.id === activeTabId,
            }}
            onTabClick={onTabClick}
            onTabClose={onTabClose}
            onTabCopyPath={onTabCopyPath}
            onTabCloseOthers={onTabCloseOthers}
            onTabCloseToRight={onTabCloseToRight}
            onTabCloseAll={onTabCloseAll}
          />
        ))}
      </div>
    </div>
  )
}
