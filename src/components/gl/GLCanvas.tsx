// src/components/gl/GLCanvas.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Renderer, Camera, Transform } from 'ogl'
import { GLScene, useGL } from './GLProvider'
import { useIO } from '@/hooks/useIO'

// Define the assets that might be needed by a scene
export type OGLAssets = {
    atlasImage: HTMLImageElement;
    atlasMeta: any; // BMFont JSON
};

// Define the shape of a function that creates a scene instance
export type CreateGLScene = (gl: WebGL2RenderingContext, assets: OGLAssets) => Promise<{
    scene: Transform;
    camera: Camera;
    update?: (time: { t: number, dt: number }) => void;
    dispose: () => void;
}>;

type Props = {
    id: string;
    className?: string;
    createGLScene: CreateGLScene;
};

export function GLCanvas({ id, className, createGLScene }: Props) {
    const ref = useRef<HTMLCanvasElement>(null);
    const { registerScene, unregisterScene } = useGL();
    const [isMounted, setIsMounted] = useState(false);

    // Use the IO hook to pause rendering when the canvas is offscreen
    useIO(ref, { id: `${id}-io`, threshold: 0.1 });

    useEffect(() => {
        setIsMounted(true);
        const canvas = ref.current;
        if (!canvas) return;

        const renderer = new Renderer({ canvas, dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
        const gl = renderer.gl as WebGL2RenderingContext;
        gl.clearColor(0, 0, 0, 0);

        let sceneInstance: Awaited<ReturnType<typeof createGLScene>> | null = null;
        let isCancelled = false;

        const setup = async () => {
            // Pre-load assets required for OGL scenes
            const atlasImage = new Image();
            atlasImage.src = '/fonts/msdf/PPNeueMontreal-Medium.png';
            const atlasMeta = await fetch('/fonts/msdf/PPNeueMontreal-Medium.json').then(res => res.json());
            await new Promise(resolve => atlasImage.onload = resolve);

            if (isCancelled) return;

            sceneInstance = await createGLScene(gl, { atlasImage, atlasMeta });

            const sceneController: GLScene = {
                id,
                render: (time) => {
                    if (canvas.classList.contains('inview')) {
                        sceneInstance?.update?.(time);
                        renderer.render({ scene: sceneInstance.scene, camera: sceneInstance.camera });
                    }
                },
                dispose: () => {
                    sceneInstance?.dispose();
                }
            };
            registerScene(sceneController);
        };

        setup();

        return () => {
            isCancelled = true;
            unregisterScene(id);
        };
    }, [id, createGLScene, registerScene, unregisterScene, isMounted]);

    return <canvas ref={ref} className={className} />;
}