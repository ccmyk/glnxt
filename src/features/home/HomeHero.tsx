// src/features/home/HomeHero.tsx
'use client'
import React, { useRef } from 'react'
import { useIO } from '@/hooks/useIO'
import DOMText from '@/components/text/DOMText' // <-- Use the new component
import { GLCanvas } from '@/components/gl/GLCanvas'
import { OGLText } from '@/lib/gl/families/tt'

function IOProbe({ id }: { id: number }) {
    return <div className="iO iO-std" data-io={id} style={{ visibility: 'visible' }} />
}

function Atitle({ text, oi }: { text: string; oi: number }) {
    return (
        <div className="Atitle">
            <div className="cCover">
                {/* OGL Canvas will mount the 'tt' family instance */}
                <GLCanvas
                    id={`home.hero.tt[${oi}]`}
                    createGLScene={async (gl, assets) => new OGLText(gl, { ...assets, text })}
                />
            </div>
            <div className="ttj Oiel act" aria-hidden="true">
                <DOMText>{text}</DOMText>
            </div>
        </div>
    )
}

export default function HomeHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const cntBtRef = useRef<HTMLDivElement>(null);

    useIO(sectionRef, { id: 'home.hero' });
    useIO(cntBtRef, { id: 'home.hero.cnt_bt' });

    return (
        <section ref={sectionRef} className="home_hero">
            <div className="c-vw cnt">
                <div className="cnt_hold">
                    <h2 className="cnt_tt">
                        <Atitle text="Chris" oi={0} />
                        <Atitle text="Hall" oi={1} />
                    </h2>

                    <div ref={cntBtRef} className="cnt_bt">
                        <IOProbe id={1} />
                        <h3 className="tt3">
                            Art Director & Designer<br />
                            Based in Los Angeles.
                        </h3>
                        <h4 className="Awrite" data-params="1.6">
                            <IOProbe id={2} />
                            <DOMText>
                                PORTFOLIO_20/25
                            </DOMText>
                        </h4>
                    </div>
                </div>

                <div className="cnt_sc">
                    <h4 className="Awrite okF" data-params="1.6" data-bucle="1">
                        <IOProbe id={3} />
                        <DOMText>Scroll to explore</DOMText>
                    </h4>
                </div>

                <div className="cnt_lk">
                    <a className="Awrite" data-params="0" href="https://www.linkedin.com/in/chrisryanhall">
                        <IOProbe id={4} />
                        <DOMText>LinkedIn</DOMText>
                        <i>{/* SVG icon here */}</i>
                    </a>
                    <a className="Awrite" data-params="0" href="https://drive.google.com/file/d/1wc46fxHbb2AgoNOu4dyDVxxVjjE_XZ1z">
                        <IOProbe id={5} />
                        <DOMText>Resume</DOMText>
                        <i>{/* SVG icon here */}</i>
                    </a>
                </div>
            </div>
        </section>
    }
