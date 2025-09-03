// src/app/layout.tsx

import type { Metadata } from 'next'
import Providers from './Providers'
import Nav from '@/components/layout/Nav'
import Loader from '@/components/layout/Loader'
import Mbg from '@/components/layout/Mbg'
import '@/styles/index.css'  // New CSS orchestration file
import '@/styles/globals.css'

export const metadata: Metadata = {
    title: 'glnxt | Eva Sánchez Migration',
    description: 'Vanilla.js to Next.js Migration',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <Providers>
            <Loader />
            <Nav />
            <Mbg />
            <main id="content">{children}</main>
        </Providers>
        </body>
        </html>
    );
}