// src/hooks/useInViewClass.ts
'use client'

import { useEffect, useRef } from 'react'

type Options = IntersectionObserverInit & {
    once?: boolean
    onEnter?: () => void
    onLeave?: () => void
}

/**
 * Toggling .stview / .inview is how your CSS triggers animations:
 * - See index.css around the Home Hero block (~2881–2993).
 */
export function useInViewClass<T extends Element>(
    ref: React.RefObject<T>,
    { threshold = [0, 1], root = null, rootMargin = '0px', once = false }: Options = {}
) {
    const seen = useRef(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        if (!seen.current) {
                            el.classList.add('stview')
                            seen.current = true
                        }
                        el.classList.add('inview')
                        if (once) io.unobserve(el)
                    } else {
                        el.classList.remove('inview')
                    }
                }
            },
            { threshold, root, rootMargin }
        )

        io.observe(el)
        return () => io.disconnect()
    }, [ref, threshold, root, rootMargin, once])
}