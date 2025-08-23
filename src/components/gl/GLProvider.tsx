// src/components/gl/GLProvider.tsx
'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'
import { useGLStore } from '@/stores/glStore'

type GLContextValue = {
    // reserved for future per-frame uniforms, time, etc.
}

const GLContext = createContext<GLContextValue | null>(null)

export function useGL() {
    const ctx = useContext(GLContext)
    if (!ctx) throw new Error('GLProvider missing')
    return ctx
}

/**
 * Single RAF fan-out. Calls active gl canvas subscribers each frame.
 */
export function GLProvider({ children }: { children: React.ReactNode }) {
    const getActive = useGLStore((s) => s.getActiveSubscribers)
    const setViewport = useAppStore((s) => s.setViewport)
    const rafRef = useRef<number | null>(null)
    const timeRef = useRef({ last: performance.now() })

    useEffect(() => {
        // viewport + DPR tracking (no layout thrash)
        const ro = new ResizeObserver((entries) => {
            const e = entries[0]
            if (!e) return
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            setViewport({
                w: Math.round(e.contentRect.width),
                h: Math.round(e.contentRect.height),
                dpr,
            })
        })
        ro.observe(document.documentElement)
        return () => ro.disconnect()
    }, [setViewport])

    useEffect(() => {
        const loop = (now: number) => {
            const dt = (now - timeRef.current.last) / 1000
            timeRef.current.last = now
            const subs = getActive()
            for (let i = 0; i < subs.length; i++) subs[i](now / 1000, dt)
            rafRef.current = requestAnimationFrame(loop)
        }
        rafRef.current = requestAnimationFrame(loop)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [getActive])

    return <GLContext.Provider value={{}}>{children}</GLContext.Provider>
}