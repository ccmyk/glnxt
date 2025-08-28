// src/components/gl/GLProvider.tsx
'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react'

// Define the shape of a scene that can be registered with the provider.
export type GLScene = {
  id: string;
  render: (time: { t: number, dt: number }) => void;
  dispose?: () => void;
};

// Define the context value that will be provided to child components.
type GLContextValue = {
  registerScene: (scene: GLScene) => void;
  unregisterScene: (id: string) => void;
};

const GLContext = createContext<GLContextValue | null>(null);

// Custom hook for easy consumption of the context.
export function useGL() {
  const ctx = useContext(GLContext);
  if (!ctx) throw new Error('useGL must be used within a GLProvider');
  return ctx;
}

/**
 * This provider manages the single, global requestAnimationFrame loop for the entire application.
 * Individual GLCanvas components will register their render functions with this provider.
 */
export function GLProvider({ children }: { children: React.ReactNode }) {
  const scenes = useRef(new Map<string, GLScene>());
  const rafId = useRef<number>();

  useEffect(() => {
    let lastTime = performance.now();
    const loop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // On each frame, call the render function for all registered scenes.
      scenes.current.forEach((scene) => {
        scene.render({ t: currentTime / 1000, dt: deltaTime });
      });

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    // Cleanup function runs when the provider unmounts.
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      // Dispose of all scenes to prevent memory leaks.
      scenes.current.forEach(scene => scene.dispose?.());
      scenes.current.clear();
    };
  }, []);

  // useMemo ensures the context value object doesn't change on every render.
  const value = useMemo(() => ({
    registerScene: (scene: GLScene) => {
      scenes.current.set(scene.id, scene);
    },
    unregisterScene: (id: string) => {
      scenes.current.get(id)?.dispose?.();
      scenes.current.delete(id);
    },
  }), []);

  return <GLContext.Provider value={value}>{children}</GLContext.Provider>;
}