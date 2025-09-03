'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from 'react-ogl';
import { Program, Plane, Texture } from 'ogl';
import { gsap } from '@/lib/gsap';
import { useGL } from '@/Providers/GLProvider';
import { useGLStore } from '@/stores/useGLStore';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Import shaders
import fragmentShader from './Media.main.fragment.glsl';
import vertexShader from './Media.main.vertex.glsl';

interface MediaProps {
  src: string;
  className?: string;
  onReady?: () => void;
}

export const Media: React.FC<MediaProps> = ({ src, className = '', onReady }) => {
  const meshRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { renderer, scene } = useGL();
  const { actions: glActions } = useGLStore();
  const { isInView } = useIntersectionObserver(containerRef, { threshold: 0.1 });

  // Integration: App lifecycle coordination
  useEffect(() => {
    if (renderer && scene) {
      glActions.registerComponent('media', containerRef.current!);
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
        uProgress: { value: 0 },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
      },
      transparent: true,
      cullFace: null,
      depthWrite: false,
    });
  }, [renderer]);

  const geometry = useMemo(() => {
    if (!renderer) return null;
    return new Plane(renderer.gl, { width: 1, height: 1 });
  }, [renderer]);

  // Integration: Page-OGL coordination - Update loop
  useFrame((state) => {
    if (!meshRef.current || !program) return;

    // Update uniforms
    program.uniforms.uTime.value = state.time * 1000;
    
    // Integration: Coordinate with global time
    glActions.updateTime(state.time, state.deltaTime);
  });

  // Integration: Event-OGL coordination - Entrance animation
  useEffect(() => {
    if (!program || !isInView) return;

    gsap.to(program.uniforms.uProgress, {
      value: 1,
      duration: 1.0,
      ease: "power2.out",
      onComplete: onReady
    });
  }, [program, isInView, onReady]);

  // Integration: App lifecycle cleanup
  useEffect(() => {
    return () => {
      glActions.unregisterComponent('media');
    };
  }, [glActions]);

  // TODO: Load texture from src
  // This maps to els.js asset loading logic

  if (!renderer || !scene || !program || !geometry) {
    return (
      <div ref={containerRef} className={`media-container ${className}`}>
        <div className="Oi">
          <div className="cCover">
            <span>Media: {src}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`media-container ${className}`}>
      <div className="Oi">
        <div className="cCover">
          <span>Media: {src}</span>
        </div>
      </div>
      
      {/* OGL Canvas will be rendered by GLProvider */}
      <mesh 
        ref={meshRef}
        geometry={geometry}
        program={program}
        position={[0, 0, 0]}
        scale={1}
      />
    </div>
  );
};
