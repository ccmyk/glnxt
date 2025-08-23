// src/app/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { GLProvider } from '@/components/gl/GLProvider'
import { GLBackgroundCanvas } from '@/components/gl/GLBackgroundCanvas'
import { GLLoaderCanvas } from '@/components/gl/GLLoaderCanvas'
import { Mbg } from '@/components/layout/Mbg'
import { Nav } from '@/components/Nav'
import { Mouse } from '@/components/Mouse'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html className="D" lang="en">
        <body>
        {/* DOM order contract: nav → #glBg → <Mbg/> → #content (loader via Portal) */}
        <Nav /> {/* .nav root inside component */}

        {/* Fixed background WebGL layer */}
        <GLBackgroundCanvas id="glBg" /> {/* id=#glBg */}

        {/* Grid rails (alignment source of truth) */}
        <Mbg /> {/* renders .Mbg and rail scaffolding */}

        {/* App content */}
        <LenisProvider>
            <GLProvider>
                <main id="content">{children}</main>
                {/* Fullscreen loader canvas (z-index above bg) */}
                <GLLoaderCanvas id="glLoader" />
            </GLProvider>
        </LenisProvider>

        {/* Cursor layer */}
        <Mouse />
        </body>
        </html>
    )
}