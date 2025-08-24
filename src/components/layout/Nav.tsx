// src/components/layout/Nav.tsx
'use client'

import React, { useEffect } from 'react'
import { useNavStore } from '@/stores/navStore'

export default function Nav(){
    const { open, setOpen } = useNavStore()

    useEffect(() => {
        // mirror vanilla: add/remove act-menu on root for CSS to react
        const root = document.documentElement
        if (open) root.classList.add('act-menu')
        else root.classList.remove('act-menu')
        return () => root.classList.remove('act-menu')
    }, [open])

    return (
        <nav className="nav">
            <button
                aria-label="Menu"
                className="nav_burger"
                onClick={() => setOpen(!open)}
            >
        <span className="nav_burger_i">
          <span /><span /><span />
        </span>
            </button>

            <div className="nav_menu">
                <div className="nav_menu_ops">
                    <a className="ops_el simp" href="/projects"><span className="rel">Projects</span></a>
                    <a className="ops_el simp" href="/about"><span className="rel">About</span></a>
                    <a className="ops_el simp" href="/playground"><span className="rel">Playground</span></a>
                </div>
                <div className="cnt_lk">
                    <a className="Awrite"><span className="iO" />Email<i><svg viewBox="0 0 7 7"><path d="M6.49 3.516H5.676V2.052l.072-.78-.036-.012-.768.864L.912 6.156.336 5.58l4.032-4.032.864-.768-.012-.036-.78.072H2.976V0h3.516v3.516Z" fill="black"/></svg></i></a>
                </div>
            </div>

            <div className="nav_blur" aria-hidden="true" />
        </nav>
    )
}