// src/components/gl/GLLoaderCanvas.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import { initLoaderGL } from '@/lib/gl/loaderRuntime'

type Props = { id?: string }
export function GLLoaderCanvas({ id = 'glLoader' }: Props) {
    const ref = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        if (!ref.current) return
        const { dispose } = initLoaderGL(ref.current)
        return () => dispose?.()
    }, [])
    // CSS expects #glLoader fixed, pointer-events:none, z-index:32
    return <canvas id={id} ref={ref} className="canvas" />
}