'use client'

import { CHAT_UI_TEXTS } from '@/features/chat/constants/ui-constants'
import { COMMON_UI_TEXTS } from '@/shared/constants/ui'
import PanelLayout from '@/shared/ui/panel-layout'

export const ChatEmptyState = () => {
  return (
    <PanelLayout>
      <div className="flex h-full flex-col items-center justify-center space-y-4 text-muted-foreground">
        <div className="text-center">
          <h3 className="mb-2 font-medium text-lg">
            {COMMON_UI_TEXTS.NO_ITEMS_AVAILABLE}
          </h3>
          <p className="text-sm">{CHAT_UI_TEXTS.START_CONVERSATION}</p>
        </div>
      </div>
    </PanelLayout>
  )
}
