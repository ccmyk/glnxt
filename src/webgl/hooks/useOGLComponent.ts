import { useRef, useEffect, useCallback } from 'react';
import { Renderer, Camera, Transform } from 'ogl';
import { useOGL } from '../providers/OGLProvider';
import { useWebGLStore } from '../stores/webgl.store';

interface UseOGLComponentOptions {
  id: string;
  element: HTMLElement;
  type: 'tt' | 'loader' | 'slider' | 'bg' | 'roll' | 'fractal' | 'pg' | 'about' | 'foot';
  width?: number;
  height?: number;
  alpha?: boolean;
}

export const useOGLComponent = (options: UseOGLComponentOptions) => {
  const { addToRenderLoop, removeFromRenderLoop } = useOGL();
  const { addComponent, removeComponent } = useWebGLStore();
  
  const rendererRef = useRef<Renderer | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const sceneRef = useRef<Transform | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    
    const { element, width, height, alpha = true } = options;
    const container = element.parentNode?.querySelector('.cCover') || element.parentNode;
    
    if (!container) return;

    const renderer = new Renderer({
      alpha,
      dpr: Math.max(window.devicePixelRatio, 2),
      width: width || element.offsetWidth,
      height: height || element.offsetHeight,
    });

    const canvas = renderer.gl.canvas as HTMLCanvasElement;
    canvas.classList.add('gl-canvas', `gl-${options.type}`);
    (container as HTMLElement).appendChild(canvas);

    const camera = new Camera(renderer.gl);
    camera.position.z = 7;
    
    const scene = new Transform();

    rendererRef.current = renderer;
    cameraRef.current = camera;
    sceneRef.current = scene;
    canvasRef.current = canvas;
    isInitializedRef.current = true;

    addComponent(options.id, {
      id: options.id,
      element: options.element,
      isVisible: false,
      isReady: true,
      type: options.type,
    });

    return () => {
      removeComponent(options.id);
      canvas.remove();
      renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
      isInitializedRef.current = false;
    };
  }, [options.id, options.element, options.type, addComponent, removeComponent]);

  const render = useCallback(() => {
    if (rendererRef.current && cameraRef.current && sceneRef.current) {
      rendererRef.current.render({
        scene: sceneRef.current,
        camera: cameraRef.current,
      });
    }
  }, []);

  return {
    renderer: rendererRef.current,
    camera: cameraRef.current,
    scene: sceneRef.current,
    canvas: canvasRef.current,
    render,
