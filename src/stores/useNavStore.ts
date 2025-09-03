import { create } from 'zustand';

interface NavState {
  isMenuOpen: boolean;
  currentPage: string;
  isScrolling: boolean;
  scrollDirection: 'up' | 'down';
  scrollProgress: number;
  actions: {
    toggleMenu: () => void;
    setCurrentPage: (page: string) => void;
    setScrolling: (scrolling: boolean) => void;
    setScrollDirection: (direction: 'up' | 'down') => void;
    setScrollProgress: (progress: number) => void;
  };
}

export const useNavStore = create<NavState>((set) => ({
  isMenuOpen: false,
  currentPage: 'home',
  isScrolling: false,
  scrollDirection: 'down',
  scrollProgress: 0,
  actions: {
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    setCurrentPage: (page) => set({ currentPage: page }),
    setScrolling: (scrolling) => set({ isScrolling: scrolling }),
    setScrollDirection: (direction) => set({ scrollDirection: direction }),
    setScrollProgress: (progress) => set({ scrollProgress: progress }),
  },
}));

// Convenience hooks
export const useNavMenu = () => useNavStore((state) => state.isMenuOpen);
export const useNavActions = () => useNavStore((state) => state.actions);
export const useCurrentPage = () => useNavStore((state) => state.currentPage);
export const useScrollState = () => useNavStore((state) => ({
  isScrolling: state.isScrolling,
  direction: state.scrollDirection,
  progress: state.scrollProgress,
}));

