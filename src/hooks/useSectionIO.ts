// src/hooks/useSectionIO.ts

// One IO hook: toggles .stview/.inview AND emits via the central bus.
// This replaces useInViewClass/useIO duplication.
// (Preserves your CSS contract: .stview/.inview/.act etc.)

'use client'
import { useEffect } from 'react'
import { emit } from '@/lib/anim/bus'

type Options = IntersectionObserverInit & {
    id: string
}

export function useSectionIO(ref: React.RefObject<HTMLElement>, opts: Options) {
    useEffect(() => {
        const el = ref.current
        if (!el) return

        // Stage immediately (matches vanilla flow)
        el.classList.add('stview')

        const {
            root = null,
            rootMargin = '0px',
            threshold = [0, 1],
            id,
        } = opts

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        el.classList.add('inview')
                        emit({ type: 'view:enter', id, el })
                    } else {
                        el.classList.remove('inview')
                        emit({ type: 'view:leave', id, el })
                    }
                }
            },
            { root, rootMargin, threshold }
        )

        io.observe(el)
        return () => io.disconnect()
    }, [ref, opts])
}