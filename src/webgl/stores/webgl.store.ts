import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface WebGLComponent {
  id: string;
  element: HTMLElement;
  isVisible: boolean;
  isReady: boolean;
  type: 'tt' | 'loader' | 'slider' | 'bg' | 'roll' | 'fractal' | 'pg' | 'about' | 'foot';
}

interface WebGLState {
  components: Map<string, WebGLComponent>;
  viewport: { width: number; height: number };
  isTouch: boolean;
  fontMSDF: any;
  fontTexture: any;
  
  addComponent: (id: string, component: WebGLComponent) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<WebGLComponent>) => void;
  updateViewport: (width: number, height: number) => void;
  setIsTouch: (isTouch: boolean) => void;
  setFontAssets: (msdf: any, texture: any) => void;
}

export const useWebGLStore = create<WebGLState>()(
  subscribeWithSelector((set, get) => ({
    components: new Map(),
    viewport: { width: 0, height: 0 },
    isTouch: false,
    fontMSDF: null,
    fontTexture: null,

    addComponent: (id, component) => set((state) => {
      const newComponents = new Map(state.components);
      newComponents.set(id, component);
      return { components: newComponents };
    }),

    removeComponent: (id) => set((state) => {
      const newComponents = new Map(state.components);
      newComponents.delete(id);
      return { components: newComponents };
    }),

    updateComponent: (id, updates) => set((state) => {
      const newComponents = new Map(state.components);
      const existing = newComponents.get(id);
      if (existing) {
        newComponents.set(id, { ...existing, ...updates });
      }
      return { components: newComponents };
    }),

    updateViewport: (width, height) => set({ viewport: { width, height } }),
    setIsTouch: (isTouch) => set({ isTouch }),
    setFontAssets: (msdf, texture) => set({ fontMSDF: msdf, fontTexture: texture }),
  }))
);

