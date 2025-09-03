'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from 'react-ogl';
import { Program, Texture, Vec2 } from 'ogl';
import { gsap } from '@/lib/gsap';
import { useGL } from '@/Providers/GLProvider';
import { useGLStore } from '@/stores/useGLStore';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Import shaders
import fragmentShader from './TtF.msdf.fragment.glsl';
import parentShader from './TtF.parent.fragment.glsl';
import vertexShader from '../Tt/Tt.msdf.vertex.glsl'; // Shared vertex shader

interface TtFProps {
  text: string;
  className?: string;
  onReady?: () => void;
}

export const TtF: React.FC<TtFProps> = ({ text, className = '', onReady }) => {
  const meshRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { renderer, scene } = useGL();
  const { actions: glActions } = useGLStore();
  const { isInView } = useIntersectionObserver(containerRef, { threshold: 0.1 });

  // Integration: App lifecycle coordination
  useEffect(() => {
    if (renderer && scene) {
      glActions.registerComponent('foot', containerRef.current!);
    }
  }, [renderer, scene, glActions]);

  // Integration: View-OGL coordination
  useEffect(() => {
    if (isInView) {
      glActions.triggerEntrance();
    } else {
      glActions.triggerExit();
    }
  }, [isInView, glActions]);

  const program = useMemo(() => {
    if (!renderer) return null;
    
    return new Program(renderer.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tMap: { value: null }, // Will be set when texture loads
        uTime: { value: 0 },
        uMouse: { value: new Vec2(0, 0) },
        uPower: { value: 1.0 },
        uStart: { value: 1.0 },
        uKey: { value: -1.0 },
        uPowers: { value: new Array(text.length).fill(0.5) },
        uColor: { value: 0.0 },
        uCols: { value: 1.5 },
      },
      transparent: true,
      cullFace: null,
      depthWrite: false,
    });
  }, [renderer, text]);

  // Integration: Page-OGL coordination - Update loop
  useFrame((state) => {
    if (!meshRef.current || !program) return;

    // Update uniforms
    program.uniforms.uTime.value = state.time * 1000;
    
    // Integration: Coordinate with global time
    glActions.updateTime(state.time, state.deltaTime);
  });

  // Integration: Event-OGL coordination - Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!meshRef.current?.program) return;
      
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      
      // Update scroll progress uniform
      meshRef.current.program.uniforms.uStart.value = 1 - progress;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Integration: App lifecycle cleanup
  useEffect(() => {
    return () => {
      glActions.unregisterComponent('foot');
    };
  }, [glActions]);

  // TODO: Load MSDF font and create texture
  // This maps to els.js asset loading logic

  if (!renderer || !scene || !program) {
    return (
      <div ref={containerRef} className={`ttf-container ${className}`}>
        <div className="Oi">
          <div className="cCover">
            <span className="char">{text}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`ttf-container ${className}`}>
      <div className="Oi">
        <div className="cCover">
          <span className="char">{text}</span>
        </div>
      </div>
      
      {/* OGL Canvas will be rendered by GLProvider */}
      <mesh 
        ref={meshRef}
        geometry={createMSDFGeometry(text)}
        program={program}
        position={[0, 0, 0]}
        scale={0.05}
      />
    </div>
  );
};

// Helper function for MSDF geometry creation
function createMSDFGeometry(text: string) {
  // Implementation for MSDF geometry creation
  // This would create proper MSDF geometry based on the font data
  return null; // Placeholder
}

