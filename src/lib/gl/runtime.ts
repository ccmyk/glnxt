// src/lib/gl/runtime.ts
type TickFn = (t: number, dt: number) => void

class Runtime {
    private subs = new Set<TickFn>()
    private raf = 0
    private last = 0

    start() {
        if (this.raf) return
        const loop = (t: number) => {
            const dt = this.last ? (t - this.last) / 1000 : 0
            this.last = t
            this.subs.forEach(fn => fn(t, dt))
            this.raf = requestAnimationFrame(loop)
        }
        this.raf = requestAnimationFrame(loop)
    }
    stop() { cancelAnimationFrame(this.raf); this.raf = 0; this.last = 0 }
    add(fn: TickFn) { this.subs.add(fn); return () => this.subs.delete(fn) }
}
export const glRuntime = new Runtime()