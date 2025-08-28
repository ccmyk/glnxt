// src/lib/anim/gsap.ts
'use client'

import gsap from 'gsap'
import SplitText from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

gsap.defaults({ overwrite: 'auto' })

export { gsap, SplitText }