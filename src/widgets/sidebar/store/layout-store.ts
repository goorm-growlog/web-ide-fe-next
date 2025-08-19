import { create } from 'zustand'

type LayoutType = 'primary-left' | 'primary-right'

interface LayoutStore {
  layout: LayoutType
  setLayout: (layout: LayoutType) => void
  toggleLayout: () => void
}

export const useLayoutStore = create<LayoutStore>((set, get) => ({
  layout: 'primary-left',

  setLayout: layout => set({ layout }),

  toggleLayout: () => {
    const currentLayout = get().layout
    const newLayout =
      currentLayout === 'primary-left' ? 'primary-right' : 'primary-left'
    set({ layout: newLayout })
  },
}))
