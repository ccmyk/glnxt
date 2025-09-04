'use client';

import React from 'react';
import { Canvas } from 'react-ogl';

type Props = { children: React.ReactNode };

// React-ogl now owns the GL context, scene, camera & RAF.
// This wrapper preserves your fixed-canvas layout & DOM overlaying.
export const GLProvider: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <Canvas
          // conservative defaults mirroring your old setup
          renderer={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 45, position: [0, 0, 1] }}
          dpr={[1, 2]}
          frameloop="always"
          onCreated={(state) => {
            // transparent bg, keep DOM visible underneath
            state.gl.clearColor(0, 0, 0, 0);
          }}
        >
          {/* Shared scene root - children OGL nodes will mount under this */}
          <transform />
        </Canvas>
      </div>
      {children}
    </>
  );
};
