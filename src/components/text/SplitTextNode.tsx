// src/components/text/SplitTextNode.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import { gsap, SplitText } from '@/lib/gsap/gsap'

type Props = {
    as?: keyof JSX.IntrinsicElements
    children: React.ReactNode
    animate?: boolean
    stagger?: number
    className?: string
}

export default function SplitTextNode({
                                          as: Tag = 'span',
                                          children,
                                          animate = false,
                                          stagger = 0.05,
                                          className,
                                      }: Props) {
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        // SplitType -> chars/words
        const split = new (SplitText as any)(el, { types: 'chars,words' })

        // Enforce fake/real handoff (.n/.f) per char
        split.chars.forEach((charEl: HTMLElement) => {
            const n = document.createElement('span')
            n.className = 'n'
            n.textContent = charEl.textContent ?? ''
            const f = document.createElement('span')
            f.className = 'f'
            f.textContent = charEl.textContent ?? ''
            charEl.replaceChildren(n, f)
            charEl.classList.add('char')
        })

        if (animate) {
            gsap.from(split.chars, {
                duration: 0.6,
                yPercent: 100,
                opacity: 0,
                ease: 'power4.inOut',
                stagger,
                clearProps: 'transform,opacity',
            })
        }

        return () => {
            // Revert DOM back on unmount
            (SplitText as any).revert(el)
        }
    }, [animate, stagger])

    return <Tag ref={ref as any} className={className}>{children}</Tag>
}