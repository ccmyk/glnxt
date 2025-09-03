// src/app/Providers.tsx
'use client'

import React from 'react'
import { AppProvider } from '@/Providers/AppProvider'
import { GLProvider } from '@/Providers/GLProvider'
import { MouseProvider } from '@/Providers/MouseProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AppProvider>
            <GLProvider>
                <MouseProvider>
                    {children}
                </MouseProvider>
            </GLProvider>
        </AppProvider>
    );
}