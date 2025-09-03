import { create } from 'zustand';

interface AnimationState {
  activeAnimations: Map<string, boolean>;
  animationQueue: string[];
  isAnimating: boolean;
  animationTimelines: Map<string, any>; // GSAP timelines
  actions: {
    startAnimation: (id: string, timeline?: any) => void;
    stopAnimation: (id: string) => void;
    queueAnimation: (id: string) => void;
    clearQueue: () => void;
    setTimeline: (id: string, timeline: any) => void;
    removeTimeline: (id: string) => void;
    pauseAnimation: (id: string) => void;
    resumeAnimation: (id: string) => void;
  };
}

export const useAnimationStore = create<AnimationState>((set, get) => ({
  activeAnimations: new Map(),
  animationQueue: [],
  isAnimating: false,
  animationTimelines: new Map(),
  actions: {
    startAnimation: (id, timeline) => {
      const { activeAnimations, animationTimelines } = get();
      activeAnimations.set(id, true);
      
      if (timeline) {
        animationTimelines.set(id, timeline);
      }
      
      set({ 
        activeAnimations: new Map(activeAnimations),
        animationTimelines: new Map(animationTimelines),
        isAnimating: true 
      });
    },
    stopAnimation: (id) => {
      const { activeAnimations, animationTimelines } = get();
      activeAnimations.set(id, false);
      animationTimelines.delete(id);
      
      set({ 
        activeAnimations: new Map(activeAnimations),
        animationTimelines: new Map(animationTimelines),
        isAnimating: Array.from(activeAnimations.values()).some(Boolean)
      });
    },
    queueAnimation: (id) => {
      const { animationQueue } = get();
      set({ animationQueue: [...animationQueue, id] });
    },
    clearQueue: () => set({ animationQueue: [] }),
    setTimeline: (id, timeline) => {
      const { animationTimelines } = get();
      animationTimelines.set(id, timeline);
      set({ animationTimelines: new Map(animationTimelines) });
    },
    removeTimeline: (id) => {
      const { animationTimelines } = get();
      animationTimelines.delete(id);
      set({ animationTimelines: new Map(animationTimelines) });
    },
    pauseAnimation: (id) => {
      const { animationTimelines } = get();
      const timeline = animationTimelines.get(id);
      if (timeline) {
        timeline.pause();
      }
    },
    resumeAnimation: (id) => {
      const { animationTimelines } = get();
      const timeline = animationTimelines.get(id);
      if (timeline) {
        timeline.resume();
      }
    },
  },
}));

// Convenience hooks
export const useAnimationState = () => useAnimationStore((state) => ({
  isAnimating: state.isAnimating,
  activeAnimations: state.activeAnimations,
  animationQueue: state.animationQueue,
}));
export const useAnimationActions = () => useAnimationStore((state) => state.actions);
export const useAnimationTimeline = (id: string) => 
  useAnimationStore((state) => state.animationTimelines.get(id));
export const useIsAnimationActive = (id: string) => 
  useAnimationStore((state) => state.activeAnimations.get(id) || false);

