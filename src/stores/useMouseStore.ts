import { create } from "zustand";

type MouseState = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  set: (s: Partial<MouseState>) => void;
};

export const useMouseStore = create<MouseState>((set) => ({
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  set: (s) => set((st) => ({ ...st, ...s })),
}));
