// src/components/layout/Loader.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from '@/stores/appStore'
import { gsap } from '@/lib/anim/gsap'
import DOMText from '../text/DOMText'

export default function Loader() {
    const isReady = useAppStore((state) => state.isReady);
    const loaderRef = useRef<HTMLDivElement>(null);
    const numberRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!loaderRef.current) return;

        // This timeline is a direct translation of the animation logic
        [cite_start]// from your vanilla project's `Loader/index.js` file. [cite: 25, 26, 29]
        const counter = { value: 0 };
        const tl = gsap.timeline({ paused: true });

        tl.to(counter, {
            value: 100,
            duration: 0.49, // Exact duration from the hideIntro function
            ease: 'power2.inOut', // Exact ease from the hideIntro function
            onUpdate: () => {
                if (numberRef.current) {
                    numberRef.current.textContent = Math.floor(counter.value).toString().padStart(3, '0');
                }
            },
        });

        if (isReady) {
            // Once the app is ready, play the "fill to 100%" animation
            tl.play();
            // Then, fade out and remove the loader, matching the original delay and ease
            gsap.to(loaderRef.current, {
                autoAlpha: 0,
                duration: 0.5, // Exact duration from hideIntro
                delay: 0.2, // Exact delay from hideIntro
                ease: 'power2.inOut', // Exact ease from hideIntro
                onComplete: () => {
                    // The loader is fully gone, so we can unmount it from the DOM
                    setIsVisible(false);
                }
            });
        }

        // Cleanup function to kill animations if the component unmounts prematurely
        return () => {
            tl.kill();
        };

    }, [isReady]);

    // Use a portal to render the loader at the top of the DOM tree
    if (typeof document === 'undefined' || !isVisible) return null;

    return createPortal(
        <div ref={loaderRef} className="loader">
            <div className="loader_bg"></div>
            <div className="loader_cnt c-vw">
                <div ref={numberRef} className="loader_tp">000</div>
                <div className="loader_bp">
                    <DOMText className="Awrite">Eva Sánchez</DOMText>
                    <DOMText className="Awrite">Portfolio © 2025</DOMText>
                </div>
            </div>
        </div>,
        document.body
    );
}