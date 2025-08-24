// src/lib/gsap/gsap.ts
'use client'

import gsap from 'gsap'
import SplitText from 'gsap/SplitText' // free as of 2025

gsap.registerPlugin(SplitText)
// Prefer overwrite to avoid ghost styles when re-entering sections
gsap.defaults({ overwrite: 'auto' })

export { gsap, SplitText }