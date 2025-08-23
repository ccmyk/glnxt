// src/components/GL/GLCanvas.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import { Sel } from '@/lib/contract/selectors'
import { register, unregister } from '@/lib/gl/registry'
import { addTicker, removeTicker, start } from '@/lib/gl/runtime'
import { createOverlayFamily } from '@/lib/gl/overlayFamily' // your OGL impl per family

type Props = {
    family: 'text' | 'media' | 'slider' | 'roll' | 'about' | 'footer' | 'playground'
    id: string
    width: number
    height: number
    className?: string
}

export function GLCanvas({ family, id, width, height, className }: Props) {
    const ref = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!ref.current) return
        const inst = createOverlayFamily(family)
        inst.mount(ref.current)
        register(family, id, inst)
        addTicker(inst)
        start()
        return () => {
            removeTicker(inst)
            unregister(family, id)
        }
    }, [family, id])

    return <canvas ref={ref} width={width} height={height} className={`${Sel.gl.canvas}${className ? ` ${className}` : ''}`} />
}