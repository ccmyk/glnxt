'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGLStore } from '@/stores/useGLStore';
import { useNavStore } from '@/stores/useNavStore';
import { useMouseStore } from '@/stores/useMouseStore';
import { useAnimationStore } from '@/stores/useAnimationStore';

interface AppContextType {
  isLoaded: boolean;
  isReady: boolean;
  currentTemplate: string;
  isWebGLSupported: boolean;
  actions: {
    setLoaded: (loaded: boolean) => void;
    setReady: (ready: boolean) => void;
    setTemplate: (template: string) => void;
    setWebGLSupported: (supported: boolean) => void;
  };
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState('home');
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  
  const { actions: glActions } = useGLStore();
  const { actions: navActions } = useNavStore();
  const { actions: mouseActions } = useMouseStore();
  const { actions: animActions } = useAnimationStore();

  // App initialization (equivalent to constructor🫀.js)
  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Check WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const webglSupported = !!gl;
        setIsWebGLSupported(webglSupported);
        
        if (!webglSupported) {
          console.warn('WebGL not supported, falling back to DOM-based animations');
        }

        // 2. Initialize stores
        glActions.setGL(webglSupported ? gl : null);
        navActions.setCurrentPage('home');
        
        // 3. Set up global event listeners
        const handleVisibilityChange = () => {
          if (document.hidden) {
            animActions.pauseAnimation('all');
          } else {
            animActions.resumeAnimation('all');
          }
        };

        const handleResize = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          // Update CSS custom properties for responsive design
          document.documentElement.style.setProperty('--ck_hvar', `${height}px`);
          document.documentElement.style.setProperty('--ck_multiL', `${width / 1920}`); // Landscape multiplier
          document.documentElement.style.setProperty('--ck_multiP', `${height / 1080}`); // Portrait multiplier
          
          // Update GL store if WebGL is supported
          if (webglSupported) {
            glActions.updateViewport(width, height);
          }
        };

        // 4. Add event listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('resize', handleResize);
        
        // 5. Initial resize call
        handleResize();
        
        // 6. Mark as loaded
        setIsLoaded(true);
        
        // 7. Wait for everything to be ready
        setTimeout(() => setIsReady(true), 100);
        
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoaded(true);
        setIsReady(true);
      }
    };

    initApp();
  }, [glActions, navActions, animActions]);

  // Handle template changes
  useEffect(() => {
    if (currentTemplate && isReady) {
      // Update navigation state
      navActions.setCurrentPage(currentTemplate);
      
      // Trigger template-specific animations
      animActions.startAnimation(`${currentTemplate}-template`);
    }
  }, [currentTemplate, isReady, navActions, animActions]);

  const contextValue: AppContextType = {
    isLoaded,
    isReady,
    currentTemplate,
    isWebGLSupported,
    actions: {
      setLoaded: setIsLoaded,
      setReady: setIsReady,
      setTemplate: setCurrentTemplate,
      setWebGLSupported: setIsWebGLSupported,
    },
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
