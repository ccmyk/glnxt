// src/lib/gsap/gsap.ts
'use client'

import gsap from 'gsap'
import SplitText from 'gsap/SplitText'   // free as of 2025
gsap.registerPlugin(SplitText)
gsap.defaults({ overwrite: 'auto' })
export { gsap, SplitText }