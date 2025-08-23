// src/stores/appStore.ts
import { create } from 'zustand'

type Viewport = { w: number; h: number; dpr: number }

type AppState = {
    viewport: Viewport
    isTouch: boolean
    setViewport: (vp: Partial<Viewport>) => void
    setIsTouch: (t: boolean) => void
}

const initial: Viewport = { w: 0, h: 0, dpr: 1 }

export const useAppStore = create<AppState>((set) => ({
    viewport: initial,
    isTouch: false,
    setViewport: (vp) =>
        set((s) => ({ viewport: { ...s.viewport, ...vp } })),
    setIsTouch: (t) => set(() => ({ isTouch: t })),
}))