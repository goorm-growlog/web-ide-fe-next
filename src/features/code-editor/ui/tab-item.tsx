import { X } from 'lucide-react'
import { getFileIcon } from '@/shared/lib/file-icons'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/shadcn/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/shared/ui/shadcn/context-menu'
import type { TabItemProps } from '../types'

/**
 * 개별 탭 아이템 컴포넌트
 */
export const TabItem = ({
  tab,
  onTabClick,
  onTabClose,
  onTabCopyPath,
  onTabCloseOthers,
  onTabCloseToRight,
  onTabCloseAll,
}: TabItemProps) => {
  return (
    <div className="group relative flex h-6 w-32 flex-shrink-0 items-center border-border border-r bg-background">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'flex h-full cursor-pointer items-center gap-1 px-1.5 py-0.5 text-xs',
              'transition-all duration-200',
              'hover:bg-muted/50',
              'flex-1 justify-start',
              'rounded-none',
              tab.isActive && ['bg-primary/5', 'font-semibold text-primary'],
            )}
            onClick={() => onTabClick(tab.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onTabClick(tab.id)
              }
            }}
            role="tab"
            tabIndex={0}
          >
            {/* 파일 아이콘 */}
            <div
              className={cn(
                'flex-shrink-0 transition-colors duration-200',
                tab.isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {getFileIcon(tab.name, 12)}
            </div>

            {/* 파일명 */}
            <span className="flex-1 truncate text-left font-medium">
              {tab.name}
            </span>
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onTabClose(tab.id)}>
            Close
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onTabCloseOthers(tab.id)}>
            Close Others
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onTabCloseToRight(tab.id)}>
            Close to the Right
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onTabCloseAll()}>
            Close All
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onTabCopyPath(tab.id)}>
            Copy Path
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* 닫기 버튼 - ContextMenuTrigger 밖에 위치 */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 flex h-full w-6 cursor-pointer items-center justify-center rounded p-1 opacity-30 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-70"
        onClick={e => {
          e.stopPropagation()
          onTabClose(tab.id)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.stopPropagation()
            onTabClose(tab.id)
          }
        }}
        aria-label={`Close ${tab.name}`}
      >
        <X size={6} />
      </Button>
    </div>
  )
}
