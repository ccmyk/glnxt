// src/stores/navStore.ts
import { create } from 'zustand'

type NavState = {
    isMenuOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
};

export const useNavStore = create<NavState>((set) => ({
    isMenuOpen: false,
    setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
}));