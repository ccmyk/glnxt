// src/components/gl/BackgroundCanvas.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import { initBackgroundGL, destroyGL } from '@/lib/gl/bgRuntime'

type Props = { id?: string }
export function GLBackgroundCanvas({ id = 'glBg' }: Props) {
    const ref = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!ref.current) return
        const { dispose } = initBackgroundGL(ref.current)
        return () => dispose?.()
    }, [])

    // CSS expects: #glBg { position:fixed; pointer-events:none; z-index:0 }
    return <canvas id={id} ref={ref} className="canvas" />
}