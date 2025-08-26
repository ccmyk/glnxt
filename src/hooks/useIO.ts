// src/hooks/useIO.ts
'use client'
import { useEffect, useRef } from 'react'

type Options = IntersectionObserverInit & { once?: boolean };

export function useIO<T extends Element>(
    ref: React.RefObject<T>,
    { threshold = [0, 1], root = null, rootMargin = '0px', once = false }: Options = {}
) {
    const hasEnteredRef = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        el.classList.add('inview');
                        if (!hasEnteredRef.current) {
                            hasEnteredRef.current = true;
                            el.classList.add('stview');
                        }
                        if (once) {
                            observer.unobserve(el);
                        }
                    } else {
                        el.classList.remove('inview');
                    }
                }
            },
            { threshold, root, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, threshold, root, rootMargin, once]);
}