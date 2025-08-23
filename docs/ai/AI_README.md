# AI Operator Guide — Vanilla → Next (OGL + GSAP + CSS)

**Goal:** Translate a bespoke vanilla.js portfolio (raw OGL, GSAP, vanilla CSS) to Next.js 15 + React 19 + TypeScript with *visual parity*. This is a **translation of intent**, not a 1:1 file mirror. The VDOM owns structure/lifecycle; imperative work stays in tiny adapters (GSAP text mount, OGL init/RAF).

## What you MUST preserve
- **Easing law:** CSS cubic-bezier in CSS only; GSAP `power2.inOut` for spatial/uniforms; GSAP `power4.inOut` for text/fades.
- **Timing profiles:** multiple named arrays from `main/anims.js` (see rules/timing-arrays.md). Build timelines from a manifest.
- **State classes:** `.stview`, `.inview`, `.act`, `.Ldd`, `.ivi`.
- **DOM order contract:** `nav → #glBg → <Mbg/> → #content` (loader via Portal).
- **Mbg rails:** remain alignment source of truth (per-section canvases snap to rails).

## What you MUST NOT do
- Do **not** introduce R3F/three/drei/troika/Framer Motion/Tailwind.
- Do **not** improvise new easings/timing values.
- Do **not** collapse DOM/GSAP text and MSDF WebGL text into a single “magic component.”

## Migration shape
- **Declarative:** layout, section shells, canvas mount order, refs as targets.
- **Imperative (isolated):** SplitText DOM surgery; OGL renderer/RAF; Lenis setup.
- **State:** Zustand for app/nav/gl; small providers for GL/Lenis.

Use the prompts in `docs/ai/prompts/*`. Enforce rules in `docs/ai/rules/*`. Pass the review gates in `docs/ai/policies/review-gates.md`.