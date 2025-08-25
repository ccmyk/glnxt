// src/features/home/HomeHero.tsx
//    Complete hero: preserves classnames, uses SplitTextNode for DOM,
//    uses GLTextTTCanvas for the Atitle OGL text, and GSAP manifest labels.

'use client'

import React, { useEffect, useRef } from 'react'
import SplitTextNode from '@/components/text/SplitTextNode'
import GLTextTTCanvas from '@/components/gl/GLTextTTCanvas'
import { useSectionIO } from '@/hooks/useSectionIO'
import { resolveLabel } from '@/lib/gsap/manifest'
import { gsap } from '@/lib/gsap/gsap'

function IOProbe({ id, className = 'iO iO-std' }: { id: number; className?: string }) {
    return <div className={className} data-io={id} style={{ visibility: 'visible' }} />
}

function Atitle({ text, oi }: { text: string; oi: number }) {
    return (
        <div className="Atitle">
            {/* OGL overlay */}
            <GLTextTTCanvas id={`home.hero.tt[${oi}]`} text={text} />

            {/* OGL “Oi” placeholder for compatibility hooks (kept for CSS/contract) */}
            <div
                className="Oi Oi-tt"
                data-temp="tt"
                data-l="-0.02"
                data-m="5"
                data-text={text}
                data-oi={oi}
                style={{ visibility: 'visible' }}
            />

            {/* DOM text layer (SplitTextNode outputs .char > .n/.f, matching CSS) */}
            <div className="ttj Oiel act" aria-hidden="true">
                <SplitTextNode as="span">{text}</SplitTextNode>
            </div>
        </div>
    )
}

export default function HomeHero() {
    const sectionRef = useRef<HTMLElement>(null)
    const cntBtRef = useRef<HTMLDivElement>(null)

    // One IO hook: toggles .stview/.inview and emits bus events
    useSectionIO(sectionRef, { id: 'home.hero', threshold: [0, 1] })
    useSectionIO(cntBtRef as any, { id: 'home.hero.cnt_bt', threshold: [0, 1] })

    // Example: manifest-driven text timelines (no magic numbers)
    useEffect(() => {
        // Title A (chars in)
        {
            const r = resolveLabel('home.hero.titleA.in')
            if (r.kind === 'timeline') {
                const { targets, from, to, stagger, ease } = r.spec
                // Use the spec’s targets if provided; else target our local chars
                const sel = targets ?? '.Atitle:nth-child(1) .char .n'
                gsap.fromTo(sel, from ?? { opacity: 0, yPercent: 100 }, { ...(to ?? { opacity: 1, yPercent: 0 }), stagger, ease })
            } else {
                const durs = r.values
                // Apply a simple 2-stage using your profile durations
                gsap.fromTo(
                    '.Atitle:nth-child(1) .char .n',
                    { opacity: 0, yPercent: 100 },
                    { opacity: 1, yPercent: 0, duration: durs[0] ?? 0.3, stagger: 0.05, ease: 'power4.inOut' }
                )
            }
        }

        // Title B (chars in)
        {
            const r = resolveLabel('home.hero.titleB.in')
            if (r.kind === 'timeline') {
                const { targets, from, to, stagger, ease } = r.spec
                const sel = targets ?? '.Atitle:nth-child(2) .char .n'
                gsap.fromTo(sel, from ?? { opacity: 0, yPercent: 100 }, { ...(to ?? { opacity: 1, yPercent: 0 }), stagger, ease, delay: 0.05 })
            } else {
                const durs = r.values
                gsap.fromTo(
                    '.Atitle:nth-child(2) .char .n',
                    { opacity: 0, yPercent: 100 },
                    { opacity: 1, yPercent: 0, duration: durs[0] ?? 0.3, stagger: 0.05, ease: 'power4.inOut', delay: 0.05 }
                )
            }
        }

        // Kicker (.Awrite line-in)
        {
            const r = resolveLabel('home.hero.kicker.in')
            if (r.kind === 'timeline') {
                const { targets, from, to, stagger, ease } = r.spec
                const sel = targets ?? '.cnt_bt .Awrite .char .n'
                gsap.fromTo(sel, from ?? { opacity: 0, yPercent: 40 }, { ...(to ?? { opacity: 1, yPercent: 0 }), stagger, ease, delay: 0.1 })
            } else {
                const durs = r.values
                gsap.fromTo(
                    '.cnt_bt .Awrite .char .n',
                    { opacity: 0, yPercent: 40 },
                    { opacity: 1, yPercent: 0, duration: durs[0] ?? 0.6, stagger: 0.08, ease: 'power4.inOut', delay: 0.1 }
                )
            }
        }

        // Links (compact)
        {
            const r = resolveLabel('home.hero.links.in')
            if (r.kind === 'timeline') {
                const { targets, from, to, stagger, ease } = r.spec
                const sel = targets ?? '.cnt_lk .Awrite'
                gsap.fromTo(sel, from ?? { opacity: 0, y: 10 }, { ...(to ?? { opacity: 1, y: 0 }), stagger, ease, delay: 0.15 })
            } else {
                const durs = r.values
                gsap.fromTo('.cnt_lk .Awrite', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: durs[0] ?? 0.22, ease: 'power4.inOut', stagger: 0.05, delay: 0.15 })
            }
        }
    }, [])

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