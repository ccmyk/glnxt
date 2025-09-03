'use client';

import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { Renderer, Camera, Transform } from 'ogl';

// This maps to create.js - the core OGL setup
interface GLContextType {
  renderer: Renderer | null;
  scene: Transform | null;
  camera: Camera | null;
  gl: WebGLRenderingContext | null;
}

const GLContext = createContext<GLContextType | null>(null);

export const useGL = () => {
  const context = useContext(GLContext);
  if (!context) {
    throw new Error('useGL must be used within GLProvider');
  }
  return context;
};

interface GLProviderProps {
  children: React.ReactNode;
}

export const GLProvider: React.FC<GLProviderProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer, setRenderer] = useState<Renderer | null>(null);
  const [scene, setScene] = useState<Transform | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [gl, setGl] = useState<WebGLRenderingContext | null>(null);

  // Initialize OGL renderer (maps to create.js)
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Create renderer (replicates create.js renderer setup)
    const newRenderer = new Renderer({
      canvas,
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      stencil: false,
      depth: false,
      powerPreference: 'high-performance',
    });

    // Create scene (replicates create.js scene setup)
    const newScene = new Transform();

    // Create camera (replicates create.js camera setup)
    const newCamera = new Camera(newRenderer.gl, {
      fov: 45,
      near: 0.1,
      far: 100,
      aspect: window.innerWidth / window.innerHeight,
    });

    // Set initial camera position
    newCamera.position.set(0, 0, 1);
    newCamera.lookAt([0, 0, 0]);

    setRenderer(newRenderer);
    setScene(newScene);
    setCamera(newCamera);
    setGl(newRenderer.gl);

    return () => {
      // Clean up
      setRenderer(null);
      setScene(null);
      setCamera(null);
      setGl(null);
    };
  }, []);

  // RAF loop (maps to create.js animation loop)
  useEffect(() => {
    if (!renderer || !scene || !camera) return;

    let rafId: number;
    
    const animate = () => {
      renderer.render({ scene, camera });
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [renderer, scene, camera]);

  // Resize handling
  useEffect(() => {
    if (!renderer || !camera) return;

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateMatrixWorld();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderer, camera]);

  const contextValue: GLContextType = {
    renderer,
    scene,
    camera,
    gl,
  };

  return (
    <GLContext.Provider value={contextValue}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />
      {children}
    </GLContext.Provider>
  );
};
