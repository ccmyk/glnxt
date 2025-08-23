// src/components/section/SectionShell.tsx
'use client'

import { useSectionIO } from '@/hooks/useSectionIO'
import { cn } from '@/lib/contract/selectors' // optional helper
type Props = { id: string; className?: string; children: React.ReactNode }
export default function SectionShell({ id, className, children }: Props) {
    const ref = useSectionIO(id)
    return <section ref={ref as any} className={className}>{children}</section>
}