# Non-Negotiable Constraints

- Easing law:
    - CSS transitions: `cubic-bezier(0.55, 0, 0.1, 1)` (CSS ONLY)
    - GSAP spatial/layout/WebGL uniforms: `power2.inOut`
    - GSAP text/fades: `power4.inOut`
- Timing profiles: multiple arrays extracted from `main/anims.js` (see rules/timing-arrays.md) — do **not** alter values.
- State classes preserved: `.stview`, `.inview`, `.act`, `.Ldd`, `.ivi`
- DOM order: `nav → #glBg → <Mbg/> → #content` (loader via Portal)
- Mbg rails/grid = alignment contract
- No R3F/Drei/Tailwind/Framer/troika; raw **OGL**, **GSAP**, **vanilla CSS**
- 60fps target; single RAF; pause offscreen canvases