// src/features/home/HomeHero.tsx
'use client'

import React, { useRef } from 'react'
import { useInViewClass } from '@/hooks/useInViewClass'
import SplitTextNode from '@/components/text/SplitTextNode'
import { GLCanvas } from '@/components/GL/GLCanvas' // your OGL overlay (per-section)
import { resolveLabel } from '@/lib/gsap/manifest'
import { gsap } from '@/lib/gsap/gsap'

function IOProbe({ id, className = 'iO iO-std' }: { id: number; className?: string }) {
    // This just renders the sentinel div the CSS and IO bus expect.
    return <div className={className} data-io={id} style={{ visibility: 'visible' }} />
}

function Atitle({ text, oi }: { text: string; oi: number }) {
    // Each Atitle = cCover canvas (OGL overlay), Oi (GL text hook), and ttj/Oiel (DOM char layer)
    return (
        <div className="Atitle">
            <div className="cCover">
                {/* Full-bleed overlay canvas sized to this block */}
                <GLCanvas className="glOverlay" />
            </div>

            {/* OGL-msdf “Oi” placeholder the GL system targets */}
            <div
                className="Oi Oi-tt"
                data-temp="tt"
                data-l="-0.02"
                data-m="5"
                data-text={text}
                data-oi={oi}
                style={{ visibility: 'visible' }}
            />

            {/* DOM text stage (SplitTextNode creates .char > .f/.n) */}
            <div className="ttj Oiel act" aria-hidden="true">
                <SplitTextNode as="span">{text}</SplitTextNode>
            </div>
        </div>
    )
}

export default function HomeHero() {
    const sectionRef = useRef<HTMLElement>(null)
    const cntBtRef = useRef<HTMLDivElement>(null)

    // Toggle .stview/.inview so your CSS transitions fire (cubic-bezier only)
    useInViewClass(cntBtRef, { threshold: [0, 1] })

    return (
        <section ref={sectionRef} className="home_hero">
            <div className="c-vw cnt">
                <div className="cnt_hold">
                    <h2 className="cnt_tt">
                        <Atitle text="Eva" oi={0} />
                        <Atitle text="Sánchez" oi={1} />
                    </h2>

                    <div ref={cntBtRef} className="cnt_bt stview inview">
                        <IOProbe id={1} />
                        <h3 className="tt3">
                            Interactive Designer
                            <br />
                            Based in Barcelona
                        </h3>

                        {/* Awrite block uses char DOM contract + probes */}
                        <h4 className="Awrite stview inview ivi" data-params="1.6" style={{ opacity: 1 }}>
                            <IOProbe id={2} />
                            <SplitTextNode as="span" animate stagger={0.05}>
                                Selected work spanning brands, products, and experiments
                            </SplitTextNode>
                        </h4>
                    </div>
                </div>

                <div className="cnt_sc">
                    <h4 className="Awrite stview inview okF" data-params="1.6" data-bucle="1" style={{ opacity: 1 }}>
                        <IOProbe id={3} />
                        <SplitTextNode as="span" animate stagger={0.05}>
                            Scroll to explore
                        </SplitTextNode>
                    </h4>
                </div>

                <div className="cnt_lk">
                    <a className="Awrite stview inview ivi" data-params="0" href="/projects" style={{ opacity: 1 }}>
                        <IOProbe id={4} />
                        <SplitTextNode as="span">Projects</SplitTextNode>
                        <i aria-hidden="true">
                            <svg viewBox="0 0 7 7" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.49 3.516H5.676V2.052l.072-.78-.036-.012-.768.864L.912 6.156.336 5.58l4.032-4.032.864-.768-.012-.036-.78.072H2.976V0h3.516v3.516Z" fill="black" />
                            </svg>
                        </i>
                    </a>

                    <a
                        className="Awrite stview inview ivi"
                        data-params="0"
                        href="https://www.linkedin.com/in/"
                        rel="noopener"
                        target="_blank"
                        style={{ opacity: 1 }}
                    >
                        <IOProbe id={5} />
                        <SplitTextNode as="span">LinkedIn</SplitTextNode>
                        <i aria-hidden="true">
                            <svg viewBox="0 0 7 7" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.49 3.516H5.676V2.052l.072-.78-.036-.012-.768.864L.912 6.156.336 5.58l4.032-4.032.864-.768-.012-.036-.78.072H2.976V0h3.516v3.516Z" fill="black" />
                            </svg>
                        </i>
                    </a>
                </div>
            </div>
        </section>
    )
}