// src/components/layout/Nav.tsx
'use client'

import React, { useEffect } from 'react'
import { useNavStore } from '@/stores/navStore'
import DOMText from '@/components/text/DOMText'

export default function Nav() {
    const { isMenuOpen, setMenuOpen } = useNavStore();

    useEffect(() => {
        const root = document.documentElement;
        if (isMenuOpen) {
            root.classList.add('act-menu');
        } else {
            root.classList.remove('act-menu');
        }
        // Cleanup function to remove the class if the component unmounts
        return () => root.classList.remove('act-menu');
    }, [isMenuOpen]);

    return (
        <nav className="nav">
            <div className="nav_blur" aria-hidden="true">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div className="nav_top c-vw">
                <div className="nav_left">
                    <a className="nav_logo" href="/">
                        <DOMText>ES</DOMText>
                    </a>
                    <div className="nav_clock">
                        <span className="nav_clock_p">
              <DOMText>Now</DOMText>
            </span>
                        <span className="nav_clock_s">—</span>
                        <span className="nav_clock_h">
              <DOMText>00</DOMText>
            </span>
                        <span className="nav_clock_s">:</span>
                        <span className="nav_clock_m">
              <DOMText>00</DOMText>
            </span>
                        <span className="nav_clock_a">
              <DOMText>AM</DOMText>
            </span>
                    </div>
                </div>

                <div className="nav_right">
                    <div className="nav_menu_ops">
                        <a href="/projects" className="ops_el">
              <span className="rel">
                <DOMText>Projects</DOMText>
              </span>
                            <span className="ghost" aria-hidden="true">
                <DOMText>Projects</DOMText>
              </span>
                        </a>
                        <a href="/about" className="ops_el">
              <span className="rel">
                <DOMText>About</DOMText>
              </span>
                            <span className="ghost" aria-hidden="true">
                <DOMText>About</DOMText>
              </span>
                        </a>
                    </div>

                    {/* Mobile navigation burger menu */}
                    <div className="nav_burger" onClick={() => setMenuOpen(!isMenuOpen)}>
                        <div className="nav_burger_i">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu panel, which is animated by the .act-menu class */}
            <div className="nav_menu">
                <div className="nav_menu_ops">
                    <a className="ops_el simp" href="/projects">
                        <span className="rel">Projects</span>
                    </a>
                    <a className="ops_el simp" href="/about">
                        <span className="rel">About</span>
                    </a>
                    <a className="ops_el simp" href="/playground">
                        <span className="rel">Playground</span>
                    </a>
                </div>
            </div>
        </nav>
    );
}