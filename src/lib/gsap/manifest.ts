// src/lib/gsap/manifest.ts
'use client'

import manifest from './gsap-manifest.json'

type Profiles = typeof manifest.profiles
export type ProfileName = keyof Profiles

export type TimelineSpec = {
  profile?: ProfileName
  targets: string              // e.g. ".char .n"
  from?: Record<string, any>
  to?: Record<string, any>
  stagger?: number
  ease?: string
}

export type ResolveResult =
  | { kind: 'timeline'; spec: TimelineSpec }
  | { kind: 'profile'; values: number[] }

export function profile(name: ProfileName): number[] {
  const p = manifest.profiles[name]
  if (!p) throw new Error(`Unknown profile: ${String(name)}`)
  return p
}

export function resolveLabel(label: string): ResolveResult {
  // 1) Try full timeline spec first (if you keep "timelines": { ... })
  const tl = (manifest as any).timelines?.[label]
  if (tl) return { kind: 'timeline', spec: tl as TimelineSpec }

  // 2) Fallback to labels → profile lookup
  const profName = (manifest as any).labels?.[label] as ProfileName | undefined
  if (profName) return { kind: 'profile', values: profile(profName) }

  throw new Error(`No timeline or profile mapping for label "${label}"`)
}