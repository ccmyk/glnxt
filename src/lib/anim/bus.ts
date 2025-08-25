// src/lib/anim/bus.ts

// Single orchestration bus (no window soup, no duplicates).
// Sections emit view enter/leave; systems can listen centrally.

// use everywhere instead of window events
type Payload = Record<string, unknown>;
type Handler<T extends Payload> = (p: T) => void;

class Bus {
    private m = new Map<string, Set<Function>>();

    on<T extends Payload>(type: string, fn: Handler<T>) {
        if (!this.m.has(type)) this.m.set(type, new Set());
        this.m.get(type)!.add(fn as any);
        return () => this.off(type, fn as any);
    }
    off(type: string, fn: Function) { this.m.get(type)?.delete(fn); }
    emit<T extends Payload>(type: string, payload: T) {
        this.m.get(type)?.forEach(fn => (fn as Handler<T>)(payload));
    }
}
export const bus = new Bus();

// Canonical events mirrored from main🐙🐙🐙 intent
export const EV = {
    ViewEnter: 'view:enter',   // { id: string, el: HTMLElement }
    ViewLeave: 'view:leave',   // { id: string, el: HTMLElement }
    TextReady: 'text:ready',   // { id: string, el: HTMLElement }
    GLMount:   'gl:mount',     // { id: string, family: string }
    GLReady:   'gl:ready',     // { id: string, family: string }
    GLTick:    'gl:tick'       // { dt:number, t:number }
} as const;