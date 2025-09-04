import { create } from "zustand";

type ScrollState = {
  y: number;
  progress: number; // 0..1
  velocity: number;
  direction: 1 | -1 | 0;
};

type AnimationState = {
  scroll: ScrollState;
  navInvert: boolean;
  setScroll: (s: Partial<ScrollState>) => void;
  setNavInvert: (v: boolean) => void;
};

export const useAnimationStore = create<AnimationState>((set) => ({
  scroll: { y: 0, progress: 0, velocity: 0, direction: 0 },
  navInvert: false,
  setScroll: (s) =>
    set((st) => ({
      scroll: { ...st.scroll, ...s },
    })),
  setNavInvert: (v) => set({ navInvert: v }),
}));
