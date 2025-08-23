// src/lib/anim/manifest.ts

// Derived from main🐙🐙🐙/anims.js recurring patterns
export const timings = {
    primary: [0.3, 0.05, 0.16, 0.05, 0.016],
    reveal:  [0.6, 0.1, 0.2,  0.1,  0.03 ],
    compact: [0.22, 0.05, 0.16, 0.05, 0.016]
} as const

export type ProfileName = keyof typeof timings

// Optional label helpers – map “heroIn”, “linesUp”,… to segments in a profile
export const labels: Record<string, { profile: ProfileName; at: number[] }> = {
    heroIn:     { profile: 'primary', at: [0, 1, 2] },
    lineReveal: { profile: 'reveal',  at: [0, 2] },
    compactIn:  { profile: 'compact', at: [0, 1, 2, 3] }
}