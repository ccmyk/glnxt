'use client';

import React, { createContext, useContext, useRef, useEffect, ReactNode } from 'react';
import { useWebGLStore } from '../stores/webgl.store';

interface OGLContextValue {
  addToRenderLoop: (fn: (time: number) => void) => void;
  removeFromRenderLoop: (fn: (time: number) => void) => void;
  isTouch: boolean;
  viewport: { width: number; height: number };
}

const OGLContext = createContext<OGLContextValue | null>(null);

export const useOGL = () => {
  const context = useContext(OGLContext);
  if (!context) {
    throw new Error('useOGL must be used within OGLProvider');
  }
  return context;
};

interface OGLProviderProps {
  children: ReactNode;
}

export const OGLProvider: React.FC<OGLProviderProps> = ({ children }) => {
  const renderLoopRef = useRef<Set<(time: number) => void>>(new Set());
  const rafRef = useRef<number>();
  const { updateViewport, setIsTouch, viewport, isTouch } = useWebGLStore();

  useEffect(() => {
    const detectTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    const handleResize = () => {
      updateViewport(window.innerWidth, window.innerHeight);
    };

    detectTouch();
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', detectTouch);

    const animate = (time: number) => {
      renderLoopRef.current.forEach(fn => fn(time));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', detectTouch);
    };
  }, [setIsTouch, updateViewport]);

  const addToRenderLoop = (fn: (time: number) => void) => {
    renderLoopRef.current.add(fn);
  };

  const removeFromRenderLoop = (fn: (time: number) => void) => {
    renderLoopRef.current.delete(fn);
  };

  const contextValue: OGLContextValue = {
    addToRenderLoop,
    removeFromRenderLoop,
    isTouch,
    viewport,
  };

  return (
    <OGLContext.Provider value={contextValue}>
      {children}
    </OGLContext.Provider>
  );
};

