// src/components/providers/MouseProvider.tsx
'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export type Mouse = {
    x: number; y: number;            // client px
    px: number; py: number;          // 0..1 normalized to viewport
    nx: number; ny: number;          // -1..1 clip-space
}

const MouseCtx = createContext<Mouse>({ x:0, y:0, px:0, py:0, nx:-1, ny:1 })
export function useMouse(){ return useContext(MouseCtx) }

export default function MouseProvider({ children }: { children: React.ReactNode }){
    const [m, setM] = useState<Mouse>({ x:0, y:0, px:0, py:0, nx:-1, ny:1 })
    const raf = useRef<number | null>(null)
    const latest = useRef({ x:0, y:0, w: 1, h: 1 })

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            latest.current = { x: e.clientX, y: e.clientY, w: window.innerWidth, h: window.innerHeight }
            if (raf.current == null) raf.current = requestAnimationFrame(flush)
        }
        const onResize = () => {
            latest.current = { ...latest.current, w: window.innerWidth, h: window.innerHeight }
        }
        const flush = () => {
            raf.current = null
            const { x, y, w, h } = latest.current
            const px = w ? x / w : 0
            const py = h ? y / h : 0
            setM({ x, y, px, py, nx: px * 2 - 1, ny: 1 - py * 2 })
        }

        window.addEventListener('mousemove', onMove, { passive: true })
        window.addEventListener('resize', onResize)
        onResize()
        return () => {
            window.removeEventListener('mousemove', onMove as any)
            window.removeEventListener('resize', onResize)
            if (raf.current != null) cancelAnimationFrame(raf.current)
        }
    }, [])

    return <MouseCtx.Provider value={m}>{children}</MouseCtx.Provider>
}