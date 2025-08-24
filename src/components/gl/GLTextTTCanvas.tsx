// src/components/gl/GLTextTTCanvas.tsx
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useGL } from './GLProvider'
import { Renderer } from 'ogl'
import { createTT } from '@/lib/gl/families/tt'
import { useResize } from '@/hooks/useResize'
import { useMouse } from '@/components/providers/MouseProvider'

export default function GLTextTTCanvas({ atlasURL }: { atlasURL?: string }){
    const hostRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { width, height } = useResize(hostRef)
    const { nx, ny } = useMouse()
    const { register, unregister } = useGL()
    const [active, setActive] = useState(true)

    useEffect(() => {
        const host = hostRef.current
        const canvas = canvasRef.current
        if (!host || !canvas) return

        const renderer = new Renderer({ canvas, dpr: Math.min(devicePixelRatio, 2) })
        const gl = renderer.gl as WebGLRenderingContext
        gl.clearColor(0,0,0,0)

        const tt = createTT(gl, { atlasURL })

        const setSize = () => {
            const r = host.getBoundingClientRect()
            const w = Math.max(1, r.width|0), h = Math.max(1, r.height|0)
            renderer.setSize(w, h)
            tt.resize(w, h)
        }
        setSize()

        const id = `tt-${Math.random().toString(36).slice(2)}`
        register({
            id,
            render: (dt) => {
                if (!active) return
                tt.setMouse(nx, ny)
                tt.render(dt)
                renderer.render({ scene: tt.scene, camera: tt.camera })
            },
            dispose: () => tt.dispose()
        })

        const io = new IntersectionObserver((es)=>setActive(es[0]?.isIntersecting ?? true), { threshold:[0,0.2,1] })
        io.observe(host)

        const onResize = () => setSize()
        window.addEventListener('resize', onResize)

        // default “enter” ramp for first paint (can be bus-driven later)
        tt.enter()

        return () => {
            window.removeEventListener('resize', onResize)
            io.disconnect()
            unregister(id)
        }
    }, [register, unregister, nx, ny, atlasURL, active])

    // width/height hook will call resize; nothing needed here

    return <div className="glOverlay" ref={hostRef}><canvas ref={canvasRef} /></div>
}