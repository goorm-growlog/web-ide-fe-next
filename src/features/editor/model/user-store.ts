// src/stores/user-store.ts

import { create } from 'zustand'
import type { UserInfo } from '@/shared/types/user'

interface UserStore {
  userInfo: UserInfo | null
  labelsVisible: boolean // 커서 라벨 표시/숨김

  /**
   * 커서 라벨 표시/숨김 토글
   */
  toggleCursorLabels: () => void

  /**
   * 임시 사용자로 초기화 (더미 데이터 설정)
   */
  initializeUser: () => void

  /**
   * userInfo를 안전하게 가져오기 (없으면 자동 초기화)
   */
  ensureUserInfo: () => UserInfo | null
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,
  labelsVisible: true,

  toggleCursorLabels: () => {
    set(state => ({ labelsVisible: !state.labelsVisible }))
  },

  initializeUser: () => {
    if (get().userInfo) return

    // 세션별 고유 사용자 생성 (커서 테스트용)
    const randomId = Math.random().toString(36).substring(2, 8)

    const newUserInfo: UserInfo = {
      email: `guest${randomId}@example.com`,
      name: '게스트 사용자',
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }
    set({ userInfo: newUserInfo })
  },

  /**
   * userInfo를 안전하게 가져오기 (없으면 자동 초기화)
   */
  ensureUserInfo: () => {
    const current = get().userInfo
    if (!current) {
      get().initializeUser()
      return get().userInfo
    }
    return current
  },
}))
