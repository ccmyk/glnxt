// src/stores/glStore.ts
import { create } from 'zustand'

export type GLSubscriber = (t: number, dt: number) => void

export type GLCanvasHandle = {
    id: string
    setOnFrame: (fn: GLSubscriber | null) => void
    setPaused: (v: boolean) => void
    isPaused: () => boolean
}

type GLState = {
    subscribers: Map<string, { fn: GLSubscriber | null; paused: boolean }>
    add: (id: string) => GLCanvasHandle
    remove: (id: string) => void
    setPaused: (id: string, v: boolean) => void
    setOnFrame: (id: string, fn: GLSubscriber | null) => void
    getActiveSubscribers: () => GLSubscriber[]
}

export const useGLStore = create<GLState>((set, get) => ({
    subscribers: new Map(),
    add: (id) => {
        set((s) => {
            const next = new Map(s.subscribers)
            next.set(id, { fn: null, paused: false })
            return { subscribers: next }
        })
        return {
            id,
            setOnFrame: (fn) => get().setOnFrame(id, fn),
            setPaused: (v) => get().setPaused(id, v),
            isPaused: () => get().subscribers.get(id)?.paused ?? false,
        }
    },
    remove: (id) =>
        set((s) => {
            const next = new Map(s.subscribers)
            next.delete(id)
            return { subscribers: next }
        }),
    setPaused: (id, v) =>
        set((s) => {
            const next = new Map(s.subscribers)
            const entry = next.get(id)
            if (entry) entry.paused = v
            return { subscribers: next }
        }),
    setOnFrame: (id, fn) =>
        set((s) => {
            const next = new Map(s.subscribers)
            const entry = next.get(id)
            if (entry) entry.fn = fn
            return { subscribers: next }
        }),
    getActiveSubscribers: () => {
        const subs = get().subscribers
        const out: GLSubscriber[] = []
        subs.forEach((v) => {
            if (!v.paused && v.fn) out.push(v.fn)
        })
        return out
    },
}))