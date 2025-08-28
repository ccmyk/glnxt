// src/app/Providers.tsx
'use client'

import React from 'react'
import { GLProvider } from '@/components/gl/GLProvider'
import { MouseProvider } from '@/components/providers/MouseProvider'
// import LenisProvider from '@/components/providers/LenisProvider' // We can add this back later

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        // <LenisProvider> // Lenis is temporarily disabled until the core UI is stable
        <GLProvider>
            <MouseProvider>
                {children}
            </MouseProvider>
        </GLProvider>
        // </LenisProvider>
    );
}