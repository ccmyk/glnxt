// src/components/gl/GLTextTTCanvas.tsx

//    Minimal per-section canvas that mounts MsdfTextTT with your atlas.
//    Single RAF (local for this canvas); pauses offscreen via useSectionIO.

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Renderer } from 'ogl'
import { MsdfTextTT } from '@/lib/gl/text/MsdfTextTT'
import { useSectionIO } from '@/hooks/useSectionIO'
import { emit } from '@/lib/anim/bus'

type Props = {
    text: string
    atlasBase?: string // default: /fonts/msdf/PPNeueMontreal-Medium
    className?: string
    id: string         // bus/view id (e.g., 'home.hero.tt[0]')
}

export default function GLTextTTCanvas({ text, atlasBase = '/fonts/msdf/PPNeueMontreal-Medium', className = 'glOverlay', id }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rafRef = useRef<number>()
    const oglRef = useRef<{ renderer: Renderer; scene: MsdfTextTT } | null>(null)
    const [active, setActive] = useState(false)

    // IO: toggles active state + emits enter/leave to the bus
    useSectionIO(ref as any, { id, threshold: [0, 1] })

    useEffect(() => {
        const holder = ref.current
        if (!holder) return

        const canvas = document.createElement('canvas')
        canvasRef.current = canvas
        canvas.className = className || 'glOverlay'
        holder.appendChild(canvas)

        const gl = (canvas.getContext('webgl2', { alpha: true, antialias: true }) ||
            canvas.getContext('webgl',   { alpha: true, antialias: true })) as WebGL2RenderingContext
        const renderer = new Renderer({ gl, dpr: Math.min(2, window.devicePixelRatio || 1) })

        const img = new Image()
        img.src = `${atlasBase}.png`
        let canceled = false

        const load = async () => {
            const res = await fetch(`${atlasBase}.json`)
            const meta = await res.json()

            await new Promise<void>((resv, rej) => {
                img.onload = () => resv()
                img.onerror = (e) => rej(e)
            })
            if (canceled) return

            const scene = new MsdfTextTT({
                gl: gl as WebGL2RenderingContext,
                atlasImage: img,
                atlasMeta: meta,
                text,
                color: 0.0,
                cols: 5,
                screen: [holder.clientWidth, holder.clientHeight],
            })

            oglRef.current = { renderer, scene }
            emit({ type: 'gl:ready', id, el: holder })

            const ro = new ResizeObserver(() => {
                size()
            })
            ro.observe(holder)

            function size() {
                const w = holder.clientWidth
                const h = holder.clientHeight
                renderer.setSize(w, h)
                scene.setSize(w, h)
            }
            size()

            const loop = (t: number) => {
                rafRef.current = requestAnimationFrame(loop)
                if (!active) return
                scene.update(t)
                renderer.render({ scene: scene.scene, camera: scene.camera })
            }
            rafRef.current = requestAnimationFrame(loop)

            return () => {
                ro.disconnect()
            }
        }

        load()

        // Observe class changes to derive active state (.inview = active)
        const mo = new MutationObserver(() => {
            const isActive = holder.classList.contains('inview')
            setActive(isActive)
        })
        mo.observe(holder, { attributes: true, attributeFilter: ['class'] })

        return () => {
            canceled = true
            mo.disconnect()
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            if (oglRef.current) {
                oglRef.current.scene.dispose()
                // renderer will GC with canvas removal
            }
            canvas.remove()
        }
    }, [text, atlasBase, className, id, active])

    return <div ref={ref} className="cCover" />
}