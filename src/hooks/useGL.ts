// src/hooks/useGL.ts
'use client'
import { useContext } from 'react'
import { GLContext } from '@/components/gl/GLProvider'

// This simple hook is the "power outlet" that allows any component
// to connect to the global RAF loop managed by GLProvider.
export function useGL() {
    const ctx = useContext(GLContext);
    if (!ctx) throw new Error('useGL must be used within a GLProvider');
    return ctx;
}