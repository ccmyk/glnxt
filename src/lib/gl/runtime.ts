// src/lib/gl/runtime.ts
let raf = 0
let running = false
type Tickable = { update?(t: number): void }
const tickers = new Set<Tickable>()

export function addTicker(t: Tickable) { tickers.add(t) }
export function removeTicker(t: Tickable) { tickers.delete(t) }

function loop(t: number) {
    tickers.forEach(x => x.update?.(t))
    raf = requestAnimationFrame(loop)
}

export function start() {
    if (!running) { running = true; raf = requestAnimationFrame(loop) }
}
export function stop() {
    running = false; cancelAnimationFrame(raf)
}