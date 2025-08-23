// src/components/text/TestRun.tsx
'use client'
import React, { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { Sel } from '@/lib/contract/selectors'
import { useTiming } from '@/lib/anim/manifest'

type Role = 'write' | 'line' | 'title'
type Props = { role: Role; as?: keyof JSX.IntrinsicElements; className?: string; children: string; id?: string }

export function TextRun({ role, as = 'div', className, children, id }: Props) {
    const Tag = as as any
    const ref = useRef<HTMLElement | null>(null)
    const t = useTiming(role === 'write' || role === 'title' ? 'primary' : 'reveal')

    const wrapperClass = useMemo(() => {
        if (role === 'line') return Sel.text.line
        if (role === 'title') return Sel.text.title
        return Sel.text.write
    }, [role])

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const real = el.querySelectorAll(`.${Sel.text.char} .${Sel.text.real}`)
        gsap.set(real, { opacity: 0, yPercent: 100 })
        gsap.to(real, {
            duration: t.duration,
            ease: 'power4.inOut',        // TEXT-ONLY easing law
            opacity: 1,
            yPercent: 0,
            stagger: t.stagger ?? 0.05,
        })
    }, [t.duration, t.stagger])

    return (
        <Tag ref={ref} className={`${wrapperClass}${className ? ` ${className}` : ''}`} id={id}>
            {[...children].map((c, i) => (
                <span key={i} className={Sel.text.char} aria-hidden="true">
          <span className={Sel.text.real}>{c}</span>
          <span className={Sel.text.fake}>{c}</span>
        </span>
            ))}
        </Tag>
    )
}