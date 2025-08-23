// src/components/section/SectionShell.tsx
'use client'
import React, { useRef } from 'react'
import { useSectionIO } from '@/hooks/useSectionIO'
import { Sel } from '@/lib/contract/selectors'

type Props = React.PropsWithChildren<{ id: string; className?: string }>

export function SectionShell({ id, className, children }: Props) {
    const ref = useRef<HTMLElement | null>(null)
    useSectionIO(ref, id)
    return (
        <section ref={ref as any} className={className}>
            {children}
            {/* marker hook used in CSS in a few places */}
            <i className={Sel.text.marker} aria-hidden />
        </section>
    )
}