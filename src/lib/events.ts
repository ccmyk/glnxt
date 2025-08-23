// src/lib/events.ts
export type AnimEnterDetail = { el: Element; id?: string }
export type AnimLeaveDetail = { el: Element; id?: string }

export const emit = {
    animEnter(detail: AnimEnterDetail) {
        document.dispatchEvent(new CustomEvent('anim:enter', { detail }))
    },
    animLeave(detail: AnimLeaveDetail) {
        document.dispatchEvent(new CustomEvent('anim:leave', { detail }))
    },
}

export const on = {
    animEnter(handler: (e: CustomEvent<AnimEnterDetail>) => void) {
        document.addEventListener('anim:enter', handler as EventListener)
        return () =>
            document.removeEventListener('anim:enter', handler as EventListener)
    },
    animLeave(handler: (e: CustomEvent<AnimLeaveDetail>) => void) {
        document.addEventListener('anim:leave', handler as EventListener)
        return () =>
            document.removeEventListener('anim:leave', handler as EventListener)
    },
}