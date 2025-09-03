// src/components/providers/LenisProvider.tsx
'use client'

import { useEffect } from 'react'

type Props = { children: React.ReactNode }

/**
 * Optional Lenis smooth-scroll wrapper.
 * If Lenis isn't installed, gracefully no-ops (native scroll).
 */
export function LenisProvider({ children }: Props) {
    useEffect(() => {
        let lenis: any
        let rafId: number | null = null

        const start = async () => {
            try {
                const mod = await import('lenis')
                const Lenis = mod.default
                lenis = new Lenis({ smoothWheel: true, smoothTouch: false })
                const raf = (t: number) => {
                    lenis.raf(t)
                    rafId = requestAnimationFrame(raf)
                }
                rafId = requestAnimationFrame(raf)
            } catch {
                // No Lenis available → do nothing (vanilla scroll)
            }
        }

        start()
        return () => {
            if (rafId) cancelAnimationFrame(rafId)
            if (lenis) lenis.destroy?.()
        }
    }, [])

    return <>{children}</>
}