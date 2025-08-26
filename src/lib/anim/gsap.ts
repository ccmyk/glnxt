// src/lib/anim/gsap.ts
'use client'
import gsap from 'gsap'
import SplitText from 'gsap/SplitText'

// Register plugins once for the entire application.
gsap.registerPlugin(SplitText)

// Set a safe default for tweens that might target the same element.
gsap.defaults({ overwrite: 'auto' })

export { gsap, SplitText }