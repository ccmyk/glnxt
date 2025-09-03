'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from 'react-ogl';
import { Program, Triangle, Vec2 } from 'ogl';
import { gsap } from '@/lib/gsap';
import { useGL } from '@/Providers/GLProvider';
import { useGLStore } from '@/stores/useGLStore';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Import shaders
import fragmentShader from './Loader.main.fragment.glsl';
import vertexShader from './Loader.main.vertex.glsl';

interface LoaderProps {
  onComplete?: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const meshRef = useRef<any>();
  const { renderer, scene } = useGL();
  const { actions: glActions } = useGLStore();
  const { isInView } = useIntersectionObserver(useRef<HTMLDivElement>(null), { threshold: 0.1 });

  // Integration: App lifecycle coordination
  useEffect(() => {
    if (renderer && scene) {
      glActions.registerComponent('loader', document.body);
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
        uTime: { value: 0 },
        uStart1: { value: 0.5 },
        uStart0: { value: 1.0 },
        uStart2: { value: 1.0 },
        uStartX: { value: 0.0 },
        uStartY: { value: 0.1 },
        uMultiX: { value: -0.4 },
        uMultiY: { value: 0.45 },
        uResolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
      },
    });
  }, [renderer]);

  const geometry = useMemo(() => {
    if (!renderer) return null;
    return new Triangle(renderer.gl);
  }, [renderer]);

  // Integration: Page-OGL coordination - Update loop
  useFrame((state) => {
    if (!meshRef.current || !program) return;

    // Update uniforms
    program.uniforms.uTime.value = state.time * 1000;
    
    // Integration: Coordinate with global time
    glActions.updateTime(state.time, state.deltaTime);
  });

  // Integration: Event-OGL coordination - GSAP timeline
  useEffect(() => {
    if (!program) return;

    const tl = gsap.timeline({ onComplete });
    
    tl.to(program.uniforms.uStart0, {
      value: 0,
      duration: 1.5,
      ease: "power2.inOut"
    })
    .to(program.uniforms.uStart2, {
      value: 0,
      duration: 1.0,
      ease: "power2.inOut"
    }, "-=0.5");

    return () => tl.kill();
  }, [program, onComplete]);

  // Integration: App lifecycle cleanup
  useEffect(() => {
    return () => {
      glActions.unregisterComponent('loader');
    };
  }, [glActions]);

  if (!renderer || !scene || !program || !geometry) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      program={program}
      position={[0, 0, 0]}
    />
  );
};

