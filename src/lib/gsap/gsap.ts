// src/lib/gsap/gsap.ts
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(SplitText)
gsap.defaults({ overwrite: 'auto' }) // safe default

export { gsap, SplitText }