// src/lib/anim/manifest.ts
export type TimingProfile = {
    duration: number;
    ease: 'power2.inOut' | 'power4.inOut';
    stagger?: number;
};

const profiles = {
    primary:  { duration: 0.3, ease: 'power4.inOut', stagger: 0.05 },
    reveal:   { duration: 0.6, ease: 'power4.inOut', stagger: 0.1  },
    compact:  { duration: 0.22, ease: 'power4.inOut', stagger: 0.05 },
    spatial:  { duration: 0.9, ease: 'power2.inOut' },      // uniforms/layout
} satisfies Record<string, TimingProfile>;

export function useTiming(name: keyof typeof profiles): TimingProfile {
    return profiles[name];
}