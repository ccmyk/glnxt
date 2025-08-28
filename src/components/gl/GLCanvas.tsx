// src/components/gl/GLCanvas.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { Renderer } from 'ogl'
import { useGL } from './GLProvider'

// Pre-load MSDF assets for the 'tt' family
type PreloadedAssets = {
    atlasImage: HTMLImageElement;
    atlasMeta: any; // The BMFont JSON
};

// A function that creates a specific OGL scene instance
type CreateSceneFn = (gl: WebGL2RenderingContext, assets: PreloadedAssets) => Promise<{
    scene: any;
    camera: any;
    update?: (time: { t: number, dt: number }) => void;
    dispose: () => void;
}>;

type Props = {
    id: string;
    className?: string;
    createGLScene: CreateSceneFn;
};

export function GLCanvas({ id, className, createGLScene }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { registerScene, unregisterScene } = useGL();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new Renderer({ canvas, dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
        const gl = renderer.gl as WebGL2RenderingContext;
        gl.clearColor(0, 0, 0, 0);

        let sceneInstance: Awaited<ReturnType<typeof createGLScene>> | null = null;
        let isMounted = true;

        // Asynchronously create the scene
        const setup = async () => {
            // In a real app, these would be loaded once and provided
            const atlasImage = new Image();
            atlasImage.src = '/fonts/msdf/PPNeueMontreal-Medium.png';
            const atlasMeta = await fetch('/fonts/msdf/PPNeueMontreal-Medium.json').then(res => res.json());
            await new Promise(resolve => atlasImage.onload = resolve);

            if (!isMounted) return;

            sceneInstance = await createGLScene(gl, { atlasImage, atlasMeta });

            const sceneController: OGLScene = {
                id,
                render: (_gl, time) => {
                    if (!sceneInstance) return;
                    sceneInstance.update?.(time);
                    renderer.render({ scene: sceneInstance.scene, camera: sceneInstance.camera });
                },
                dispose: () => {
                    sceneInstance?.dispose();
                }
            };

            registerScene(sceneController);
        };

        setup();

        return () => {
            isMounted = false;
            unregisterScene(id);
        };
    }, [id, createGLScene, registerScene, unregisterScene]);

    return <canvas ref={canvasRef} className={className} />;
}