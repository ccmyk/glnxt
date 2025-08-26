// src/features/home/HomeHero.tsx
'use client'
import React, { useRef } from 'react'
import { useIO } from '@/hooks/useIO'
import SplitTextNode from '@/components/text/SplitTextNode'
// GLCanvas and OGLText would be imported here once created.

function Atitle({ text, oi }: { text: string; oi: number }) {
    return (
        <div className="Atitle">
            <div className="cCover">
                {/* <GLCanvas family="tt" text={text} /> */}
            </div>
            <div className="Oi Oi-tt" data-oi={oi}></div>
            <div className="ttj Oiel act" aria-hidden="true">
                <SplitTextNode>{text}</SplitTextNode>
            </div>
        </div>
    )
}

export default function HomeHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const cntBtRef = useRef<HTMLDivElement>(null);

    useIO(sectionRef, { id: 'home.hero' });
    useIO(cntBtRef, { id: 'home.hero.cnt_bt' });

    // GSAP animations using the manifest would be triggered in a useEffect
    // based on IO state changes communicated via the event bus.

    return (
        <section ref={sectionRef} className="home_hero">
            <div className="c-vw cnt">
                <div className="cnt_hold">
                    <h2 className="cnt_tt">
                        <Atitle text="Chris" oi={0} />
                        <Atitle text="Hall" oi={1} />
                    </h2>

                    <div ref={cntBtRef} className="cnt_bt">
                        <h3 className="tt3">
                            Art Director & Designer<br />
                            Based in Las Angeles.
                        </h3>
                        <h4 className="Awrite">
                            <SplitTextNode>
                                PORTFOLIO_20/25
                            </SplitTextNode>
                        </h4>
                    </div>
                </div>
                {/* ... other elements like cnt_sc and cnt_lk would follow ... */}
            </div>
        </section>
    )
}