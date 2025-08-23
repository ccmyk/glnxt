
// src/features/home/HomeIntro.tsx
'use client'

import SectionShell from '@/components/section/SectionShell'
import { buildTextIntro } from '@/lib/anim/textTimelines'
import { useEffect, useRef } from 'react'
import { bus, EV } from '@/lib/anim/bus'
import GLCanvas from '@/components/gl/GLCanvas' // this calls createTextOverlay() inside

export default function HomeIntro() {
    const titleRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        const h = titleRef.current
        if (!h) return
        const { tl, kill } = buildTextIntro(h, 'primary')
        const offEnter = bus.on(EV.ViewEnter, ({ id }) => { if (id==='home:intro') tl.play(0) })
        const offLeave = bus.on(EV.ViewLeave, ({ id }) => { if (id==='home:intro') tl.reverse() })
        bus.emit(EV.TextReady, { id: 'home:intro', el: h })
        return () => { offEnter(); offLeave(); kill() }
    }, [])

    return (
        <SectionShell id="home:intro" className="home_hero">
            <h3 ref={titleRef} className="tt3 Awrite">{/* original classes preserved */}Hello.</h3>
            {/* Per-section overlay, family='text' mirrors 💬 */}
            <GLCanvas family="text" id="home:intro" className="cCover" />
        </SectionShell>
    )
}