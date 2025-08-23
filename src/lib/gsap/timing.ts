// src/lib/gsap/timing.ts
import manifest from './gsap-manifest.json'
export type ProfileName = keyof typeof manifest.profiles
export function profile(name: ProfileName): number[] {
    return manifest.profiles[name]
}
export function labelProfile(label: string): number[] {
    const p = manifest.labels[label] as ProfileName | undefined
    if (!p) throw new Error(`No profile for label: ${label}`)
    return profile(p)
}