// src/hooks/useInViewClass.ts
'use client'

import { useEffect } from 'react'

type Options = IntersectionObserverInit & {
    onEnter?: () => void
    onLeave?: () => void
}

/**
 * Toggling .stview / .inview is how your CSS triggers animations:
 * - See index.css around the Home Hero block (~2881–2993).
 */
export function useInViewClass(ref: React.RefObject<Element>, options: Options = {}) {
    useEffect(() => {
        const el = ref.current
        if (!el) return

        const {
            root = null,
            rootMargin = '0px',
            threshold = [0, 1], // matches your vanilla IO patterns
            onEnter,
            onLeave,
        } = options

        const io = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    el.classList.add('stview', 'inview')
                    onEnter?.()
                    // Optional: dispatch the same event shape your system uses
                    document.dispatchEvent(
                        new CustomEvent('anim:enter', { detail: { el, state: 1, style: 0, params: [0] } })
                    )
                } else {
                    el.classList.remove('inview')
                    onLeave?.()
                    document.dispatchEvent(
                        new CustomEvent('anim:leave', { detail: { el, state: 0, style: 0, params: [0] } })
                    )
                }
            }
        }, { root, rootMargin, threshold })

        io.observe(el)
        return () => io.disconnect()
    }, [ref, options.root, options.rootMargin, options.threshold])
}