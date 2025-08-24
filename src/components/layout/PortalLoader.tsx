// src/components/layout/PortalLoader.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '@/stores/appStore'

export default function PortalLoader(){
    const ready = useAppStore(s => s.ready)         // set to true when initial assets/first frame
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return createPortal(
        <div className="loader" style={{ display: ready ? 'none' : 'block' }}>
            <div className="ld_cnt">
                <div className="ld_bar" />
                <div className="ld_text Awrite">Loading…</div>
            </div>
        </div>,
        document.body
    )
}