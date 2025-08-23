// src/lib/gsap/gsap.ts

'use client'

import gsap from 'gsap'
import SplitText from 'gsap/SplitText'

// Register plugins once
gsap.registerPlugin(SplitText)

// Safe defaults for tweens that target the same props
gsap.defaults({ overwrite: 'auto' })

// Optional: export a tiny “easing law” helper to avoid mistakes in app code
export const easing = {
    text: 'power4.inOut',     // text/fades only
    spatial: 'power2.inOut',  // layout/WebGL uniforms
} as const

export { gsap, SplitText }