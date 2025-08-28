// src/components/providers/MouseProvider.tsx
'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { gsap } from '@/lib/anim/gsap'

type MouseContextValue = {
    x: number;
    y: number;
};

const MouseContext = createContext<MouseContextValue>({ x: 0, y: 0 });

export function MouseProvider({ children }: { children: React.ReactNode }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <MouseContext.Provider value={position}>
            {children}
        </MouseContext.Provider>
    );
}

// The simple hook that components will use to access mouse data.
export function useMouse() {
    return useContext(MouseContext);
}