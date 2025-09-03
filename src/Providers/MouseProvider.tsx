'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// This maps to events.js - global mouse/touch handling
interface MouseContextType {
  mouse: { x: number; y: number };
  mouseNormalized: { x: number; y: number };
  isMouseDown: boolean;
  isTouching: boolean;
}

const MouseContext = createContext<MouseContextType | null>(null);

export const useMouse = () => {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error('useMouse must be used within MouseProvider');
  }
  return context;
};

interface MouseProviderProps {
  children: React.ReactNode;
}

export const MouseProvider: React.FC<MouseProviderProps> = ({ children }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [mouseNormalized, setMouseNormalized] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      // Normalize to -1 to 1 range (maps to events.js normalization)
      const normalizedX = (x / window.innerWidth) * 2 - 1;
      const normalizedY = -(y / window.innerHeight) * 2 + 1;
      
      setMouse({ x, y });
      setMouseNormalized({ x: normalizedX, y: normalizedY });
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    
    const handleTouchStart = () => setIsTouching(true);
    const handleTouchEnd = () => setIsTouching(false);

    // Add event listeners (maps to events.js event binding)
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const contextValue: MouseContextType = {
    mouse,
    mouseNormalized,
    isMouseDown,
    isTouching,
  };

  return (
    <MouseContext.Provider value={contextValue}>
      {children}
    </MouseContext.Provider>
  );
};
