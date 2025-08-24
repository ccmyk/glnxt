// src/components/gl/GLCanvas.tsx
'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGL } from './GLProvider'
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from 'ogl'
import { useResize } from '@/hooks/useResize'

type Props = {
    id?: string
    className?: string
    // optionally pass a ref to the container you want to observe for in-view
    observeRef?: React.RefObject<HTMLElement | null>
}

export function GLCanvas({ id, className, observeRef }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rootRef = useRef<HTMLDivElement>(null)
    const { width, height } = useResize(rootRef)
    const { register, unregister } = useGL()
    const [active, setActive] = useState(true)

    // Simple in-view toggling for pause
    useEffect(() => {
        const el = (observeRef?.current ?? rootRef.current) as Element | null
        if (!el) return
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) setActive(e.isIntersecting)
            },
            { threshold: [0, 0.1, 0.5, 1] }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [observeRef])

    useEffect(() => {
        const canvas = canvasRef.current
        const host = rootRef.current
        if (!canvas || !host) return

        // OGL setup
        const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), canvas })
        const gl = renderer.gl
        gl.clearColor(0, 0, 0, 0)

        const camera = new Camera(gl)
        camera.orthographic({ left: -1, right: 1, bottom: -1, top: 1, near: 0, far: 1 })
        const scene = new Transform()

        // Basic full-quad you can replace with your family program later
        const geometry = new Geometry(gl, {
            position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
            uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
        })

        const program = new Program(gl, {
            vertex: `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
            fragment: `
        precision highp float;
        varying vec2 vUv;
        void main() {
          // transparent by default; replace with family shader
          gl_FragColor = vec4(0.0,0.0,0.0,0.0);
        }
      `,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        })

        const mesh = new Mesh(gl, { geometry, program })
        mesh.setParent(scene)

        // Size to the host container
        const setSize = () => {
            const r = host.getBoundingClientRect()
            const dpr = Math.min(window.devicePixelRatio, 2)
            // Prevent 0x0 canvases
            const w = Math.max(1, Math.floor(r.width))
            const h = Math.max(1, Math.floor(r.height))
            renderer.dpr = dpr
            renderer.setSize(w, h)
            gl.viewport(0, 0, w, h)
        }

        setSize()

        // Scene object registered to global RAF
        const sceneId = id ?? `gl-overlay-${Math.random().toString(36).slice(2)}`
        const sceneObj = {
            id: sceneId,
            render: (dt: number) => {
                if (!active) return
                renderer.render({ scene, camera })
            },
            setActive: (a: boolean) => setActive(a),
            dispose: () => {
                // clean up OGL resources
                try {
                    program?.remove()
                    ;(mesh as any)?.delete?.()
                } catch {}
                const lose = gl.getExtension('WEBGL_lose_context')
                lose?.loseContext()
            },
        }

        register(sceneObj)

        // Resize on host size changes and when width/height change
        setSize()

        const onResize = () => setSize()
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
            unregister(sceneId)
        }
    }, [register, unregister, active])

    // Update size when hooks say size changed
    useEffect(() => {
        const canvas = canvasRef.current
        const host = rootRef.current
        if (!canvas || !host) return
        const ev = new Event('resize')
        window.dispatchEvent(ev)
    }, [width, height])

    return (
        <div ref={rootRef} className={className}>
            <canvas ref={canvasRef} />
        </div>
    )
}