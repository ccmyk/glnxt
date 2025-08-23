// src/hooks/useSectionIO.ts
'use client'
import { useEffect } from 'react'
import { Sel } from '@/lib/contract/selectors'
import { emit } from '@/lib/anim/bus'

export function useSectionIO(ref: React.RefObject<HTMLElement>, id: string) {
    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.classList.add(Sel.state.staged)

        const ob = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    el.classList.add(Sel.state.inview)
                    emit({ type: 'view:enter', id })
                } else {
                    el.classList.remove(Sel.state.inview)
                    emit({ type: 'view:leave', id })
                }
            })
        }, { threshold: [0, 1] })

        ob.observe(el)
        return () => ob.disconnect()
    }, [ref, id])
}