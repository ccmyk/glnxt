// src/lib/gsap/manifest.ts

//  Resolve labels → either a full timeline spec or a profile.
//  Works with your existing gsap-manifest.json (keep timelines!)

'use client'

import manifest from './gsap-manifest.json'

// Types inferred from your JSON
type Profiles = Record<string, number[]>
type TimelineSpec = {
    profile?: string
    targets?: string
    stagger?: number
    from?: Record<string, unknown>
    to?: Record<string, unknown>
    ease?: string
}
type Timelines = Record<string, TimelineSpec>
type Labels = Record<string, string>

export type Resolved =
    | { kind: 'timeline'; spec: TimelineSpec; key: string }
    | { kind: 'profile'; name: string; values: number[] }

export function resolveLabel(label: string): Resolved {
    const labels = (manifest as { labels?: Labels }).labels || {}
    const ref = labels[label]
    if (!ref) {
        throw new Error(`Unknown label '${label}'. Add it in gsap-manifest.json → "labels".`)
    }

    const tl = (manifest as { timelines?: Timelines }).timelines?.[ref]
    if (tl) return { kind: 'timeline', spec: tl, key: ref }

    const prof = (manifest as { profiles?: Profiles }).profiles?.[ref]
    if (prof) return { kind: 'profile', name: ref, values: prof }

    throw new Error(
        `Label '${label}' maps to '${ref}', which is neither a known timeline nor profile key`
    )
}