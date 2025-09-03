import { create } from 'zustand';

interface MouseState {
  position: { x: number; y: number };
  normalizedPosition: { x: number; y: number };
  isMouseDown: boolean;
  isTouching: boolean;
  hoveredElement: HTMLElement | null;
  hoveredElementType: string | null;
  actions: {
    updatePosition: (x: number, y: number) => void;
    updateNormalizedPosition: (x: number, y: number) => void;
    setMouseDown: (down: boolean) => void;
    setTouching: (touching: boolean) => void;
    setHoveredElement: (element: HTMLElement | null, type?: string) => void;
    clearHoveredElement: () => void;
  };
}

export const useMouseStore = create<MouseState>((set) => ({
  position: { x: 0, y: 0 },
  normalizedPosition: { x: 0, y: 0 },
  isMouseDown: false,
  isTouching: false,
  hoveredElement: null,
  hoveredElementType: null,
  actions: {
    updatePosition: (x, y) => set({ position: { x, y } }),
    updateNormalizedPosition: (x, y) => set({ normalizedPosition: { x, y } }),
    setMouseDown: (down) => set({ isMouseDown: down }),
    setTouching: (touching) => set({ isTouching: touching }),
    setHoveredElement: (element, type) => set({ 
      hoveredElement: element, 
      hoveredElementType: type || null 
    }),
    clearHoveredElement: () => set({ 
      hoveredElement: null, 
      hoveredElementType: null 
    }),
  },
}));

// Convenience hooks
export const useMousePosition = () => useMouseStore((state) => state.position);
export const useMouseNormalized = () => useMouseStore((state) => state.normalizedPosition);
export const useMouseActions = () => useMouseStore((state) => state.actions);
export const useMouseInteraction = () => useMouseStore((state) => ({
  isMouseDown: state.isMouseDown,
  isTouching: state.isTouching,
  hoveredElement: state.hoveredElement,
  hoveredElementType: state.hoveredElementType,
}));

