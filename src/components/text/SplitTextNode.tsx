// src/components/text/SplitTextNode.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import { gsap, SplitText } from '@/lib/anim/gsap'

type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function SplitTextNode({ children, className }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const split = new SplitText(el, { types: 'chars,words' });

        // Enforce the .char > .n + .f DOM structure required by the CSS contract.
        split.chars.forEach((charEl: HTMLElement) => {
            const originalText = charEl.textContent ?? '';
            const n = document.createElement('span');
            n.className = 'n';
            n.textContent = originalText;
            const f = document.createElement('span');
            f.className = 'f';
            f.textContent = originalText;

            charEl.innerHTML = '';
            charEl.appendChild(n);
            charEl.appendChild(f);
        });

        return () => {
            if (split.revert) {
                split.revert();
            }
        };
    }, [children]);

    return <div ref={ref} className={className}>{children}</div>;
}