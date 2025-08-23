# Timing Arrays (named profiles, immutable)
Extract from `main/anims.js`:
- primary: [0.3, 0.05, 0.16, 0.05, 0.016]
- reveal:  [0.6, 0.1, 0.2, 0.1, 0.03]
- compact: [0.22, 0.05, 0.16, 0.05, 0.016]

Use a `gsap-manifest.json` to map labels → durations/eases/staggers.
Timelines must read from the manifest (no inline numbers) and keep label order identical to vanilla.