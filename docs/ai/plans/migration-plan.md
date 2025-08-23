# Migration Plan

Phase 1: Skeleton
- Root layout enforces DOM order (nav → #glBg → <Mbg/> → #content; loader via Portal).
- LenisProvider + GLProvider; Zustand stores (app/nav/gl).

Phase 2: Text system
- SplitType→GSAP SplitText adapter with `.char > .f/.n` handoff.
- Extract `main/anims.js` timings → `gsap-manifest.json`. No inline numbers.
- Hook `useIO` for `anim:*` enter/leave.

Phase 3: OGL overlays
- BackgroundCanvas + LoaderCanvas (fullscreen).
- Per-section `GLCanvas` overlays (size to section rect; snap to Mbg).
- Families ported one by one; uniforms driven by `power2.inOut`.

Phase 4: Pages & content
- Views to sections; MDX replaces WP REST.
- Preserve state classes & scroll choreography.

Phase 5: Perf & QA
- Pause offscreen canvases; texture reuse.
- A11y/perf/parity checklists.