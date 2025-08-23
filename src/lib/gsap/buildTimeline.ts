// src/lib/gsap/buildTimeline.ts
'use client'

import gsap from 'gsap'
import manifest from './gsap-manifest.json'
import { EASE_TEXT } from './easing'

type TimelineKey = keyof typeof manifest.timelines
type BuildArgs = {
    root: HTMLElement
    key: TimelineKey
    /** start paused so callers can .play() after any prep */
    paused?: boolean
}

function getProfileDuration(profileName: keyof typeof manifest.profiles | undefined) {
    if (!profileName) return 0.6
    const arr = manifest.profiles[profileName]
    // convention: first segment as base duration; others can be used for chained labels if needed
    return Array.isArray(arr) && arr.length ? arr[0] : 0.6
}

/**
 * Create a GSAP timeline from the manifest.
 * - No inline numeric literals beyond safe fallbacks.
 * - Text timelines default to power4.inOut.
 */
export function buildTimeline({ root, key, paused = true }: BuildArgs) {
    const def = manifest.timelines[key]
    if (!def) throw new Error(`Timeline "${key}" not found in manifest`)

    const duration = getProfileDuration(def.profile as any)
    const ease = def.ease ?? EASE_TEXT
    const targets = Array.from(root.querySelectorAll(def.targets)) as HTMLElement[]
    const tl = gsap.timeline({ paused })

    if (def.from && def.to) {
        tl.fromTo(
            targets,
            { ...def.from },
            { ...def.to, duration, ease, stagger: def.stagger ?? 0 }
        )
    } else if (def.from) {
        tl.from(targets, { ...def.from, duration, ease, stagger: def.stagger ?? 0 })
    } else if (def.to) {
        tl.to(targets, { ...def.to, duration, ease, stagger: def.stagger ?? 0 })
    }

    return tl
}