// src/hooks/useSectionIO.ts
'use client'

import { useEffect, useRef } from 'react'
import { bus, EV } from '@/lib/anim/bus'

export function useSectionIO(id: string, rootMargin = '0px') {
    const ref = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.classList.add('stview')

        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    el.classList.add('inview')
                    bus.emit(EV.ViewEnter, { id, el })
                } else {
                    el.classList.remove('inview')
                    bus.emit(EV.ViewLeave, { id, el })
                }
            }
        }, { root: null, rootMargin, threshold: [0, 1] })

        io.observe(el)
        return () => io.disconnect()
    }, [id, rootMargin])

    return ref
}