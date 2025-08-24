// src/lib/events.ts
export type AnimEnterDetail = { el: Element; id?: string }
export type AnimLeaveDetail = { el: Element; id?: string }
type AnimDetail = { el?: Element | null; state?: number; style?: number; params?: number[] }

const inBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined'

export const emit = {
    animEnter(detail: AnimEnterDetail) {
        if (!inBrowser()) return
        document.dispatchEvent(new CustomEvent('anim:enter', { detail }))
    },
    animLeave(detail: AnimLeaveDetail) {
        if (!inBrowser()) return
        document.dispatchEvent(new CustomEvent('anim:leave', { detail }))
    },
}

export const on = {
    animEnter(handler: (e: CustomEvent<AnimEnterDetail>) => void) {
        if (!inBrowser()) return () => {}
        const fn = handler as EventListener
        document.addEventListener('anim:enter', fn)
        return () => document.removeEventListener('anim:enter', fn)
    },
    animLeave(handler: (e: CustomEvent<AnimLeaveDetail>) => void) {
        if (!inBrowser()) return () => {}
        const fn = handler as EventListener
        document.addEventListener('anim:leave', fn)
        return () => document.removeEventListener('anim:leave', fn)
    },
}

export function dispatchAnim(type: string, detail: AnimDetail = {}) {
    if (!inBrowser()) return
    window.dispatchEvent(new CustomEvent(`anim:${type}`, { detail }))
}

export function onAnim(type: string, handler: (e: CustomEvent<AnimDetail>) => void) {
    if (!inBrowser()) return () => {}
    const fn = handler as unknown as EventListener
    window.addEventListener(`anim:${type}`, fn)
    return () => window.removeEventListener(`anim:${type}`, fn)
}