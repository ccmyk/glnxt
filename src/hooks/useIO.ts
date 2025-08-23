// src/hooks/useIO.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type IOArgs = {
    root?: Element | null
    threshold?: number[] | number
    once?: boolean
    onEnter?: (entry: IntersectionObserverEntry) => void
    onLeave?: (entry: IntersectionObserverEntry) => void
}

export function useIO({
                          root = null,
                          threshold = [0, 1],
                          once = false,
                          onEnter,
                          onLeave,
                      }: IOArgs = {}) {
    const [inView, setInView] = useState(false)
    const targetRef = useRef<Element | null>(null)
    const seenRef = useRef(false)

    const setRef = useCallback((el: Element | null) => {
        targetRef.current = el
    }, [])

    useEffect(() => {
        const el = targetRef.current
        if (!el) return

        const th = Array.isArray(threshold) ? threshold : [threshold]
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isIntersecting = entry.isIntersecting
                    if (isIntersecting) {
                        if (!seenRef.current) onEnter?.(entry)
                        setInView(true)
                        if (once) {
                            seenRef.current = true
                            io.unobserve(entry.target)
                        }
                    } else {
                        setInView(false)
                        onLeave?.(entry)
                    }
                })
            },
            { root: root as Element | null, threshold: th }
        )

        io.observe(el)
        return () => io.disconnect()
    }, [root, threshold, once, onEnter, onLeave])

    return { ref: setRef, inView }
}