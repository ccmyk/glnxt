// src/components/gl/GLProvider.tsx
'use client'
import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useGLStore } from '@/stores/glStore'

export type OGLScene = {
    id: string;
    render: (time: { t: number, dt: number }) => void;
    dispose?: () => void;
};

type GLContextValue = {
    registerScene: (scene: OGLScene) => void;
    unregisterScene: (id: string) => void;
};

const GLContext = createContext<GLContextValue | null>(null);

export function useGL() {
    const ctx = useContext(GLContext);
    if (!ctx) throw new Error('useGL must be used within a GLProvider');
    return ctx;
}

export function GLProvider({ children }: { children: React.ReactNode }) {
    const scenes = useRef(new Map<string, OGLScene>());
    const rafId = useRef<number>();
    const { setViewport, setDpr, setReady } = useGLStore();

    useEffect(() => {
        // Update the store with viewport dimensions
        const onResize = () => {
            setViewport({ width: window.innerWidth, height: window.innerHeight });
            setDpr(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', onResize);
        onResize(); // Initial call

        let lastTime = performance.now();
        const loop = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            scenes.current.forEach((scene) => scene.render({ t: currentTime / 1000, dt: deltaTime }));
            rafId.current = requestAnimationFrame(loop);
        };
        rafId.current = requestAnimationFrame(loop);

        setReady(true); // Signal that the GL provider is ready

        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            scenes.current.forEach(scene => scene.dispose?.());
            scenes.current.clear();
            window.removeEventListener('resize', onResize);
        };
    }, [setViewport, setDpr, setReady]);

    const value = useMemo(() => ({
        registerScene: (scene: OGLScene) => scenes.current.set(scene.id, scene),
        unregisterScene: (id: string) => {
            scenes.current.get(id)?.dispose?.();
            scenes.current.delete(id);
        },
    }), []);

    return <GLContext.Provider value={value}>{children}</GLContext.Provider>;
}