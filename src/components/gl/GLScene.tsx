// src/components/gl/GLScene.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import { Renderer } from 'ogl'
import { useGL, OGLScene } from './GLProvider'
import { useIO } from '@/hooks/useIO'

export type OGLAssets = { /* Define asset types as needed */ };

export type CreateGLScene = (gl: WebGL2RenderingContext, assets: OGLAssets) => Promise<{
    scene: any;
    camera: any;
    update?: (time: { t: number, dt: number }) => void;
    dispose: () => void;
    resize?: (width: number, height: number) => void;
}>;

type Props = {
    id: string;
    className?: string;
    createGLScene: CreateGLScene;
};

export function GLScene({ id, className, createGLScene }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { registerScene, unregisterScene } = useGL();

    useIO(containerRef, { id: `${id}-io`, threshold: 0.1 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        const renderer = new Renderer({ canvas, dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
        const gl = renderer.gl as WebGL2RenderingContext;
        gl.clearColor(0, 0, 0, 0);

        let sceneInstance: Awaited<ReturnType<typeof createGLScene>> | null = null;
        let isCancelled = false;

        const setup = async () => {
            // Asset loading would be managed here or passed in
            const assets: OGLAssets = {};
            sceneInstance = await createGLScene(gl, assets);
            if (isCancelled) return;

            const sceneController: OGLScene = {
                id,
                render: (time) => {
                    if (container.classList.contains('inview')) {
                        sceneInstance?.update?.(time);
                        renderer.render({ scene: sceneInstance.scene, camera: sceneInstance.camera });
                    }
                },
                dispose: () => sceneInstance?.dispose(),
            };
            registerScene(sceneController);
        };
        setup();

        const onResize = () => {
            const { width, height } = container.getBoundingClientRect();
            renderer.setSize(width, height);
            sceneInstance?.resize?.(width, height);
        };
        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(container);
        onResize();

        return () => {
            isCancelled = true;
            resizeObserver.disconnect();
            unregisterScene(id);
            container.removeChild(canvas);
        };
    }, [id, createGLScene, registerScene, unregisterScene]);

    // This container div is what aligns to the .Mbg grid and provides sizing
    return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
}