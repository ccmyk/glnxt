// src/lib/anim/spatialTimelines.ts
import { gsap } from '@/lib/gsap/gsap'
import { timings } from './manifest'

type Uniform = { value: number | [number, number] | any }

export function tweenUniform(uniform: Uniform, to: number, profile: keyof typeof timings = 'reveal') {
    const [d0] = timings[profile]
    return gsap.to(uniform, {
        duration: d0,
        value: to,
        ease: 'power2.inOut' // spatial/uniform easing law
    })
}