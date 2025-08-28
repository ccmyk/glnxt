// src/components/providers/MouseProvider.tsx
'use client'

import React, { useEffect } from 'react'
import { useGLStore } from '@/stores/glStore'

export function MouseProvider({ children }: { children: React.ReactNode }) {
    const setMouse = useGLStore((state) => state.setMouse);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Convert pixel coordinates to normalized device coordinates [-1, 1]
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            setMouse({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [setMouse]);

    return <>{children}</>;
}