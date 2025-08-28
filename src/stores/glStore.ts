// src/stores/glStore.ts
import { create } from 'zustand'

type Viewport = { width: number; height: number };
type Mouse = { x: number; y: number }; // Normalized coordinates [-1, 1]

type GLState = {
    isReady: boolean;
    viewport: Viewport;
    dpr: number;
    mouse: Mouse;
    setReady: (isReady: boolean) => void;
    setViewport: (viewport: Viewport) => void;
    setDpr: (dpr: number) => void;
    setMouse: (mouse: Mouse) => void;
};

export const useGLStore = create<GLState>((set) => ({
    isReady: false,
    viewport: { width: 0, height: 0 },
    dpr: 1,
    mouse: { x: 0, y: 0 },
    setReady: (isReady) => set({ isReady }),
    setViewport: (viewport) => set({ viewport }),
    setDpr: (dpr) => set({ dpr }),
    setMouse: (mouse) => set({ mouse }),
}));