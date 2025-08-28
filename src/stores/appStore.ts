// src/stores/appStore.ts
import { create } from 'zustand'

type AppState = {
    isReady: boolean;
    setIsReady: (isReady: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
    isReady: false,
    setIsReady: (isReady) => set({ isReady }),