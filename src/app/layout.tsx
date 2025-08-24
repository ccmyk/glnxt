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
import MouseProvider from '@/components/providers/MouseProvider'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html className="D" lang="en">
        <body>
        {/* DOM order contract: nav → #glBg → <Mbg/> → #content (loader via Portal) */}
        <Nav />
        <GLBackgroundCanvas id="glBg" /> {/* id=#glBg */}
        <Mbg />

        {/* App content */}
        <LenisProvider>
            <GLProvider>
                <MouseProvider>
                <main id="content">
                    {children}
                </main>
                </MouseProvider>
                <GLLoaderCanvas id="glLoader" />
            </GLProvider>
        </LenisProvider>

        {/* Cursor layer */}
        <Mouse />
        </body>
        </html>
    )
}