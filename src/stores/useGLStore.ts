import { create } from 'zustand';

interface GLState {
  // OGL handles are optional now that Canvas owns the loop
  renderer: any | null;
  scene: any | null;
  camera: any | null;
  gl: WebGLRenderingContext | null;
  time: number;
  deltaTime: number;
  isAnimating: boolean;
  viewport: { width: number; height: number };
  components: Map<string, HTMLElement>;
  currentScene: string;
  actions: {
    setRenderer: (renderer: any) => void;
    setScene: (scene: any) => void;
    setCamera: (camera: any) => void;
    setGL: (gl: WebGLRenderingContext | null) => void;
    updateTime: (time: number, deltaTime: number) => void;
    startAnimation: () => void;
    stopAnimation: () => void;
    updateViewport: (width: number, height: number) => void;
    registerComponent: (type: string, element: HTMLElement) => void;
    unregisterComponent: (type: string) => void;
    setSceneName: (sceneName: string) => void;
    triggerEntrance: () => void;
    triggerExit: () => void;
    completeLoading: () => void;
    updateScrollProgress: (progress: number) => void;
    handleInteraction: (data: any) => void;
    cleanup: () => void;
  };
}

export const useGLStore = create<GLState>((set, get) => ({
  renderer: null,
  scene: null,
  camera: null,
  gl: null,
  time: 0,
  deltaTime: 0,
  isAnimating: false,
  viewport: { width: 0, height: 0 },
  components: new Map(),
  currentScene: 'home',
  actions: {
    setRenderer: (renderer) => set({ renderer }),
    setScene: (scene) => set({ scene }),
    setCamera: (camera) => set({ camera }),
    setGL: (gl) => set({ gl }),
    updateTime: (time, deltaTime) => set({ time, deltaTime }),
    startAnimation: () => set({ isAnimating: true }),
    stopAnimation: () => set({ isAnimating: false }),
    updateViewport: (width, height) => set({ viewport: { width, height } }),
    registerComponent: (type, element) => {
      const { components } = get();
      components.set(type, element);
      set({ components: new Map(components) });
    },
    unregisterComponent: (type) => {
      const { components } = get();
      components.delete(type);
      set({ components: new Map(components) });
    },
    setSceneName: (sceneName) => set({ currentScene: sceneName }),
    triggerEntrance: () => {
      // Trigger entrance animations for all registered components
      const { components } = get();
      components.forEach((element, type) => {
        // This would trigger entrance animations based on component type
        console.log(`Triggering entrance for ${type} component`);
      });
    },
    triggerExit: () => {
      // Trigger exit animations for all registered components
      const { components } = get();
      components.forEach((element, type) => {
        // This would trigger exit animations based on component type
        console.log(`Triggering exit for ${type} component`);
      });
    },
    completeLoading: () => {
      // Handle loading completion
      console.log('Loading completed');
    },
    updateScrollProgress: (progress) => {
      // Update scroll progress for scroll-aware components
      const { components } = get();
      if (components.has('foot')) {
        // Update footer scroll progress
        console.log(`Footer scroll progress: ${progress}`);
      }
    },
    handleInteraction: (data) => {
      // Handle interaction data from components
      console.log('Interaction data:', data);
    },
    cleanup: () => {
      // Clean up all components and reset state
      set({
        components: new Map(),
        currentScene: 'home',
        isAnimating: false
      });
    },
  },
}));

export const useGLRenderer = () => useGLStore((state) => state.renderer);
export const useGLScene = () => useGLStore((state) => state.scene);
export const useGLCamera = () => useGLStore((state) => state.camera);
export const useGLContext = () => useGLStore((state) => state.gl);
export const useGLTime = () => useGLStore((state) => ({ time: state.time, deltaTime: state.deltaTime }));
export const useGLAnimation = () => useGLStore((state) => state.isAnimating);
export const useGLActions = () => useGLStore((state) => state.actions);
export const useGLViewport = () => useGLStore((state) => state.viewport);
export const useGLComponents = () => useGLStore((state) => state.components);
export const useCurrentScene = () => useGLStore((state) => state.currentScene);
