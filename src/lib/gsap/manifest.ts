// src/lib/gsap/manifest.ts
import manifest from './gsap-manifest.json'

export type TimelineSpec = typeof manifest.timelines[keyof typeof manifest.timelines]

export function resolveLabel(label: string): { kind: 'timeline', spec: TimelineSpec } | { kind: 'profile', name: string, values: number[] } {
    const ref = (manifest.labels as Record<string, string>)[label]
    if (!ref) throw new Error(`Unknown label: ${label}`)

    const tl = (manifest.timelines as Record<string, TimelineSpec>)[ref]
    if (tl) return { kind: 'timeline', spec: tl }

    const prof = (manifest.profiles as Record<string, number[]>)[ref]
    if (prof) return { kind: 'profile', name: ref, values: prof }

    throw new Error(`Label '${label}' maps to neither timeline nor profile: ${ref}`)
}