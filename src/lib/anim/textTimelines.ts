// src/lib/anim/textTimelines.ts
import { gsap, SplitText } from '@/lib/gsap/gsap'
import { timings } from './manifest'

// DOM text: SplitText → chars .n/.f + power4.inOut
export function buildTextIntro(el: HTMLElement, profile: keyof typeof timings = 'primary') {
    // replicate vanilla structure: .char > .n/.f dual spans
    const split = new SplitText(el, { type: 'chars,words' })
    split.chars.forEach(ch => {
        const n = document.createElement('span'); n.className = 'n'
        const f = document.createElement('span'); f.className = 'f'
        while (ch.firstChild) f.appendChild(ch.firstChild)
        ch.append(n, f)
    })

    const tl = gsap.timeline({ paused: true })
    const [d0, d1, d2] = timings[profile]
    tl.from(split.chars, {
        duration: d0,
        yPercent: 100,
        opacity: 0,
        stagger: d1,
        ease: 'power4.inOut' // text easing law
    })
    return { tl, split, kill: () => { split.revert(); tl.kill() } }
}