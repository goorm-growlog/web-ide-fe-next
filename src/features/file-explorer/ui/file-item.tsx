'use client'

import { ChevronRightIcon, FolderIcon, FolderOpenIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import type { FileItemProps } from '@/features/file-explorer/types/file-explorer'
import { INDENT_SIZE_PX } from '@/shared/constants/ui'
import { getFileIcon } from '@/shared/lib/file-icons'
import { cn } from '@/shared/lib/utils'

const FileItem = ({ item, iconSize, onFileOpen }: FileItemProps) => {
  const itemLevel = item.getItemMeta().level
  const isFolder = item.isFolder()
  const isExpanded = item.isExpanded()
  const isSelected = item.isSelected()
  const isFocused = item.isFocused()

  const handleContextMenu = useCallback(() => {
    if (isFolder && !isExpanded) {
      item.expand()
    }
  }, [isFolder, isExpanded, item])

  const handleClick = useCallback(() => {
    if (isFolder) {
      // 폴더인 경우: 확장/축소
      if (isExpanded) {
        item.collapse()
      } else {
        item.expand()
      }
    } else if (onFileOpen) {
      // 파일인 경우: 즉시 파일 열기 (디바운스 제거)
      const filePath = item.getId()
      onFileOpen(filePath)
    }
  }, [isFolder, isExpanded, onFileOpen, item])

  const paddingLeft = useMemo(
    () => itemLevel * INDENT_SIZE_PX + iconSize,
    [itemLevel, iconSize],
  )

  const iconElement = useMemo(() => {
    if (isFolder) {
      return (
        <>
          <ChevronRightIcon
            data-state={isExpanded ? 'open' : 'closed'}
            className={cn(
              'transition-transform duration-200',
              isExpanded ? 'rotate-90' : 'rotate-0',
            )}
            size={iconSize}
          />
          {isExpanded ? (
            <FolderOpenIcon size={iconSize} />
          ) : (
            <FolderIcon size={iconSize} />
          )}
        </>
      )
    }
    return (
      <>
        <div className="flex-shrink-0" style={{ width: `${iconSize}px` }} />
        {getFileIcon(item.getItemName(), iconSize)}
      </>
    )
  }, [isFolder, isExpanded, iconSize, item])

  const {
    className: itemClassName,
    // headless-tree의 onContextMenu는 preventDefault()를 호출해서 브라우저 기본 컨텍스트 메뉴를 차단함
    // shadcn/ui ContextMenu를 사용하기 위해서는 이 핸들러를 제거하고 이벤트 전파를 허용해야 함
    onContextMenu: _,
    // button 관련 속성들을 제거하여 중첩된 button 문제 해결
    type: _type,
    ...restProps
  } = item.getProps()

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClick()
      }
    },
    [handleClick],
  )

  return (
    <button
      type="button"
      {...restProps}
      data-file-item
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        itemClassName,
        // 기본 스타일
        'flex w-full cursor-pointer items-center gap-1 py-1',
        'transition-colors duration-150 ease-in-out',
        // 키보드 접근성
        'focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-inset',
        // 상태별 스타일 (우선순위: selected > focused > hover)
        isSelected && 'bg-sidebar-accent text-sidebar-accent-foreground',
        !isSelected &&
          isFocused &&
          'rounded ring-2 ring-sidebar-ring ring-inset',
        !isSelected && 'hover:bg-sidebar-accent/30',
      )}
    >
      <div className="flex gap-1" style={{ paddingLeft }}>
        {iconElement}
      </div>
      <div className="flex w-full gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {item.isRenaming() ? (
          <input
            {...item.getRenameInputProps()}
            onFocus={e => e.target.select()}
          />
        ) : (
          item.getItemName()
        )}
      </div>
    </button>
  )
}

export default FileItem
