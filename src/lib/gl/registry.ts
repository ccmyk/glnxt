// src/lib/gl/registry.ts
type FamilyKey = 'bg' | 'loader' | 'text' | 'media' | 'slider' | 'roll' | 'about' | 'footer' | 'playground';

type Instance = {
    mount(canvas: HTMLCanvasElement): void
    resize?(w: number, h: number): void
    update?(t: number): void
    dispose?(): void
};

const registry = new Map<string, Instance>(); // key = `${family}:${id}`

export function register(family: FamilyKey, id: string, inst: Instance) {
    registry.set(`${family}:${id}`, inst)
}
export function unregister(family: FamilyKey, id: string) {
    registry.get(`${family}:${id}`)?.dispose?.()
    registry.delete(`${family}:${id}`)
}
export function forEach(cb: (i: Instance) => void) {
    registry.forEach(cb)
}