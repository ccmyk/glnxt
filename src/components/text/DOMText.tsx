// src/components/text/DOMText.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { gsap, SplitText } from '@/lib/anim/gsap'

type Props = {
    children: React.ReactNode;
    className ? : string;
    // Add other props for animation control as needed
};

export default function DOMText({
    children,
    className
}: Props) {
    const ref = useRef < HTMLDivElement > (null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Use GSAP's SplitText to split the text into characters and words.
        const split = new SplitText(el, {
            types: 'chars,words'
        });

        // Create the fake/real (.f/.n) spans to match the CSS contract.
        split.chars.forEach((charEl: HTMLElement) => {
            const originalText = charEl.textContent ?? '';
            const n = document.createElement('span');
            n.className = 'n';
            n.textContent = originalText;
            const f = document.createElement('span');
            f.className = 'f';
            f.textContent = originalText;

            // Clear the original character and append the new structure.
            charEl.innerHTML = '';
            charEl.appendChild(n);
            charEl.appendChild(f);
        });

        // Return a cleanup function to revert the split on unmount.
        return () => {
            if (split.revert) {
                split.revert();
            }
        };
    }, [children]);

    return <div ref = {
        ref
    }
    className = {
        className
    } > {
        children
    } </div>;
}