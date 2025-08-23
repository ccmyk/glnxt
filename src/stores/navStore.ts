// src/stores/navStore.ts
import { create } from 'zustand'

type NavState = {
    route: string
    sectionId: string | null
    isMenuOpen: boolean
    setRoute: (r: string) => void
    setSection: (id: string | null) => void
    setMenuOpen: (v: boolean) => void
}

export const useNavStore = create<NavState>((set) => ({
    route: '/',
    sectionId: null,
    isMenuOpen: false,
    setRoute: (r) => set(() => ({ route: r })),
    setSection: (id) => set(() => ({ sectionId: id })),
    setMenuOpen: (v) => set(() => ({ isMenuOpen: v })),
}))