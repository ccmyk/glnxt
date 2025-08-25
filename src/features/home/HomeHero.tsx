// src/features/home/HomeHero.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { useInViewClass } from '@/hooks/useInViewClass'
import SplitTextNode from '@/components/text/SplitTextNode'
import { GLCanvas } from '@/components/gl/GLCanvas'
import { resolveLabel } from '@/lib/gsap/manifest'
import { gsap } from '@/lib/gsap/gsap'
import { dispatchAnim } from '@/lib/events'
import { createTT_WGL2 } from '@/lib/gl/overlayFamily';

function IOProbe({ id, className = 'iO iO-std' }: { id: number; className?: string }) {
    return <div className={className} data-io={id} style={{ visibility: 'visible' }} />
}

function Atitle({ text, oi, innerRef }: { text: string; oi: number; innerRef?: React.Ref<HTMLDivElement> }) {
    return (
        <div className="Atitle" ref={innerRef}>
            <div className="cCover">
                <GLCanvas
                    className="glOverlay"
                    onCreate={async (gl, size) => {
                        const ctx = gl as WebGL2RenderingContext;
                        return await createTT_WGL2(ctx, size, text);
                    }}
                />
            </div>
            <div
                className="Oi Oi-tt"
                data-temp="tt"
                data-l="-0.02"
                data-m="5"
                data-text={text}
                data-oi={oi}
                style={{ visibility: 'visible' }}
            />
            <div className="ttj Oiel act" aria-hidden="true">
                <SplitTextNode as="span">{text}</SplitTextNode>
            </div>
        </div>
    )
}

export default function HomeHero() {
    const sectionRef = useRef<HTMLElement>(null)
    const cntBtRef = useRef<HTMLDivElement>(null)
    const titleARef = useRef<HTMLDivElement>(null)
    const titleBRef = useRef<HTMLDivElement>(null)
    const linksRef = useRef<HTMLDivElement>(null)

    useInViewClass(cntBtRef, { threshold: [0, 1] })

    // Anim bus: section enter/leave
    useEffect(() => {
        const sec = sectionRef.current
        if (!sec) return
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        dispatchAnim('home.hero.enter', { el: sec, state: 1 })
                    } else {
                        dispatchAnim('home.hero.leave', { el: sec, state: 0 })
                    }
                }
            },
            { threshold: [0, 0.5, 1] }
        )
        io.observe(sec)
        return () => io.disconnect()
    }, [])

    function animateByLabel(root: Element | null, label: string) {
        if (!root) return
        const r = resolveLabel(label)
        if (r.kind === 'timeline') {
            const { targets, from, to, stagger, ease } = r.spec
            const scoped = root.querySelectorAll(targets)
            if (!scoped.length) return
            if (from) gsap.fromTo(scoped, from, { ...(to ?? {}), stagger, ease })
            else gsap.to(scoped, { ...(to ?? {}), stagger, ease })
        } else {
            const [d0] = r.values
            const scoped = root.querySelectorAll('.char .n')
            if (!scoped.length) return
            gsap.from(scoped, {
                duration: d0 ?? 0.3,
                yPercent: 100,
                opacity: 0,
                ease: 'power4.inOut',
                stagger: 0.05,
                clearProps: 'transform,opacity',
            })
        }
    }

    useEffect(() => {
        animateByLabel(titleARef.current, 'home.hero.titleA.in')
        animateByLabel(titleBRef.current, 'home.hero.titleB.in')
        animateByLabel(cntBtRef.current, 'home.hero.kicker.in')
        animateByLabel(linksRef.current, 'home.hero.links.in')
    }, [])

    return (
        <section ref={sectionRef} className="home_hero">
            <div className="c-vw cnt">
                <div className="cnt_hold">
                    <h2 className="cnt_tt">
                        <Atitle text="Chris" oi={0} innerRef={titleARef} />
                        <Atitle text="Hall" oi={1} innerRef={titleBRef} />
                    </h2>

                    <div ref={cntBtRef} className="cnt_bt stview inview">
                        <IOProbe id={1} />
                        <h3 className="tt3">
                            Art Director & Designer
                            <br />
                            Based in Los Angeles.
                        </h3>
                        <h4 className="Awrite stview inview ivi" data-params="1.6" style={{ opacity: 1 }}>
                            <IOProbe id={2} />
                            <SplitTextNode as="span" animate stagger={0.05}>
                                Portfolio_20/25
                            </SplitTextNode>
                        </h4>
                    </div>
                </div>

                <div className="cnt_sc">
                    <h4 className="Awrite stview inview okF" data-params="1.6" data-bucle="1" style={{ opacity: 1 }}>
                        <IOProbe id={3} />
                        <SplitTextNode as="span" animate stagger={0.05}>
                            {Scroll to explore}
                        </SplitTextNode>
                    </h4>
                </div>

                <div className="cnt_lk" ref={linksRef}>
                    <a
                        className="Awrite stview inview ivi"
                        data-params="0"
                        href="https://www.linkedin.com/in/chrisryanhall"
                        rel="noopener"
                        target="_blank"
                        style={{ opacity: 1 }}
                    >
                        <IOProbe id={5} />
                        <SplitTextNode as="span">LINKEDIN</SplitTextNode>
                        <i aria-hidden="true">
                            <svg viewBox="0 0 7 7" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.49 3.516H5.676V2.052l.072-.78-.036-.012-.768.864L.912 6.156.336 5.58l4.032-4.032.864-.768-.012-.036-.78.072H2.976V0h3.516v3.516Z" fill="black" />
                            </svg>
                        </i>
                    </a>

                    <a
                        className="Awrite stview inview ivi"
                        data-params="0"
                        href="https://drive.google.com/file/d/1wc46fxHbb2AgoNOu4dyDVxxVjjE_XZ1z"
                        style={{ opacity: 1 }}
                    >
                        <IOProbe id={4} />
                        <SplitTextNode as="span">RESUME</SplitTextNode>
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