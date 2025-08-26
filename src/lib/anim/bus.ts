// src/lib/anim/bus.ts
'use client'

type EventDetail = {
    el?: Element | null;
    id?: string;
    [key: string]: any;
};

const inBrowser = () => typeof window !== 'undefined';

export function dispatch(eventName: string, detail: EventDetail = {}) {
    if (!inBrowser()) return;
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function on(eventName: string, handler: (e: CustomEvent<EventDetail>) => void) {
    if (!inBrowser()) return () => {};
    const fn = handler as EventListener;
    window.addEventListener(eventName, fn);
    return () => window.removeEventListener(eventName, fn);
}