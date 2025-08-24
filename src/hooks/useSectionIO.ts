// src/hooks/useSectionIO.ts
'use client'

import { useEffect, useRef } from 'react'
import { dispatchAnim } from '@/lib/events'

type Options = IntersectionObserverInit & { once?: boolean; id?: string }

export function useSectionIO<T extends Element>(
    ref: React.RefObject<T>,
    { threshold = [0, 0.5, 1], root = null, rootMargin = '0px', once = false, id }: Options = {}
) {
    const seen = useRef(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        if (!seen.current) {
                            el.classList.add('stview')
                            seen.current = true
                        }
                        el.classList.add('inview')
                        dispatchAnim('view.enter', { el, state: 1, params: [], style: 0 })
                        if (id) dispatchAnim(`${id}.enter`, { el, state: 1 })
                        if (once) io.unobserve(el)
                    } else {
                        el.classList.remove('inview')
                        dispatchAnim('view.leave', { el, state: 0, params: [], style: 0 })
                        if (id) dispatchAnim(`${id}.leave`, { el, state: 0 })
                    }
                }
            },
            { threshold, root, rootMargin }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [ref, threshold, root, rootMargin, once, id])
}