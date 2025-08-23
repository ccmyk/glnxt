# Prompt: task-migrate

Task: Migrate {component/page} to React/Next + TS.
- If text: use SplitText adapter with `.char > .f/.n`; GSAP text uses `power4.inOut`.
- If WebGL: raw OGL inside `GLCanvas`; uniforms animated with `power2.inOut`.
- Pull timings from `lib/gsap/gsap-manifest.json`; add labels as in vanilla.
- Mount overlay canvases inside section shells; snap to Mbg.
- No Tailwind; keep original CSS classes.
  Output: full files.