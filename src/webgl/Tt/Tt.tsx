'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from 'react-ogl';
import { Program, Texture, Vec2 } from 'ogl';
import { gsap } from '@/lib/gsap';
import { useGL } from '@/Providers/GLProvider';
import { useMouse } from '@/Providers/MouseProvider';
import { useGLStore } from '@/stores/useGLStore';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Import shaders
import fragmentShader from './Tt.msdf.fragment.glsl';
import vertexShader from './Tt.msdf.vertex.glsl';

interface TtProps {
  text: string;
  className?: string;
  onReady?: () => void;
}

export const Tt: React.FC<TtProps> = ({ text, className = '', onReady }) => {
  const meshRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { renderer, scene } = useGL();
  const { mouseNormalized } = useMouse();
  const { actions: glActions } = useGLStore();
  const [isInView, setIsInView] = useState(false);
  const [font, setFont] = useState<any>(null);
  const [texture, setTexture] = useState<Texture | null>(null);

  // Integration: Intersection Observer (position.js logic)
  const { ref: triggerRef } = useIntersectionObserver({
    threshold: 0.1,
    onChange: (inView) => {
      setIsInView(inView);
      if (inView) {
        glActions.triggerEntrance();
      } else {
        glActions.triggerExit();
      }
    }
  });

  // Integration: App lifecycle coordination
  useEffect(() => {
    if (renderer && scene) {
      glActions.registerComponent('tt', containerRef.current!);
    }
  }, [renderer, scene, glActions]);

  // Integration: View-OGL coordination
  useEffect(() => {
    if (isInView && meshRef.current?.program) {
      // Start entrance animation
      const program = meshRef.current.program;
      gsap.to(program.uniforms.uStart, {
        value: 0,
        duration: 1.0,
        ease: "power4.inOut",
        onComplete: () => {
          program.uniforms.uKey.value = -1; // Set to idle state
        }
      });
    }
  }, [isInView]);

  // Integration: Event-OGL coordination - Mouse interaction
  useEffect(() => {
    if (!meshRef.current?.program) return;

    const program = meshRef.current.program;
    const handleMouseMove = (e: MouseEvent) => {
      if (program.uniforms.uKey.value === -1) {
        program.uniforms.uKey.value = 0; // Set to interactive state
      }
      
      // Calculate character positions based on mouse
      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const normalizedX = (x / rect.width) * 2 - 1;
      
      // Update mouse uniform
      program.uniforms.uMouse.value.set(normalizedX, 0);
      
      // Update character powers based on mouse position
      const chars = text.length;
      const powers = new Array(chars).fill(0).map((_, i) => {
        const charPos = (i / chars) * 2 - 1;
        const distance = Math.abs(normalizedX - charPos);
        return Math.max(0, 1 - distance * 2);
      });
      
      program.uniforms.uPowers.value = powers;
    };

    const handleMouseLeave = () => {
      if (program.uniforms.uKey.value === 0) {
        program.uniforms.uKey.value = -1; // Return to idle state
      }
    };

    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [text, isInView]);

  // Integration: Page-OGL coordination - Update loop
  useFrame((state) => {
    if (!meshRef.current || !texture) return;

    // Update uniforms
    const program = meshRef.current.program;
    program.uniforms.uTime.value = state.time * 1000;
    program.uniforms.uMouse.value.set(mouseNormalized.x, mouseNormalized.y);
    
    // Integration: Coordinate with global time
    glActions.updateTime(state.time, state.deltaTime);
  });

  // Integration: App lifecycle cleanup
  useEffect(() => {
    return () => {
      glActions.unregisterComponent('tt');
    };
  }, [glActions]);

  // TODO: Load MSDF font and create texture
  // This maps to els.js asset loading logic

  if (!renderer || !scene || !font || !texture) {
    return (
      <div ref={containerRef} className={`tt-container ${className}`}>
        <div ref={triggerRef} className="Oi">
          <div className="cCover">
            <span className="char">{text}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`tt-container ${className}`}>
      <div ref={triggerRef} className="Oi">
        <div className="cCover">
          <span className="char">{text}</span>
        </div>
      </div>
      
      {/* OGL Canvas will be rendered by GLProvider */}
      <mesh 
        ref={meshRef}
        geometry={createMSDFGeometry(font, text)}
        program={createMSDFProgram(renderer.gl, texture, text)}
        position={[0, 0, 0]}
        scale={0.05}
      />
    </div>
  );
};

// Helper functions for MSDF setup
function createMSDFGeometry(font: any, text: string) {
  // Implementation for MSDF geometry creation
  // This would create proper MSDF geometry based on the font data
  return null; // Placeholder
}

function createMSDFProgram(gl: WebGLRenderingContext, texture: Texture, text: string) {
  // Implementation for MSDF program creation
  // This would create the shader program with proper uniforms
  return null; // Placeholder
}