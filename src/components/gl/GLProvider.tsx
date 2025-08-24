// src/components/gl/GLProvider.tsx
'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react'

export type GLScene = {
    id: string
    render: (dt: number) => void
    setActive?: (active: boolean) => void
    dispose?: () => void
}

type Ctx = {
    register: (s: GLScene) => void
    unregister: (id: string) => void
}

const GLContext = createContext<Ctx | null>(null)

export function useGL() {
    const ctx = useContext(GLContext)
    if (!ctx) throw new Error('GLProvider missing')
    return ctx
}

export default function GLProvider({ children }: { children: React.ReactNode }) {
    const scenes = useRef<Map<string, GLScene>>(new Map())
    const running = useRef(false)
    const rafId = useRef<number | null>(null)
    const last = useRef<number>(0)

    const loop = (t: number) => {
        rafId.current = requestAnimationFrame(loop)
        const dt = last.current ? (t - last.current) / 1000 : 0
        last.current = t
        // render all registered scenes (they can internally no-op if not active)
        scenes.current.forEach((s) => s.render(dt))
    }

    const start = () => {
        if (running.current) return
        running.current = true
        last.current = 0
        rafId.current = requestAnimationFrame(loop)
    }

    const stop = () => {
        if (!running.current) return
        running.current = false
        if (rafId.current != null) cancelAnimationFrame(rafId.current)
        rafId.current = null
    }

    useEffect(() => {
        // Start RAF as soon as provider mounts (keeps timing consistent)
        start()
        return () => {
            stop()
            scenes.current.forEach((s) => s.dispose?.())
            scenes.current.clear()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const value = useMemo<Ctx>(
        () => ({
            register: (s) => {
                scenes.current.set(s.id, s)
            },
            unregister: (id) => {
                const s = scenes.current.get(id)
                s?.dispose?.()
                scenes.current.delete(id)
            },
        }),
        []
    )

    return <GLContext.Provider value={value}>{children}</GLContext.Provider>
}