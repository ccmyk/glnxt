# File Contracts (what goes where)

- **CSS**: keep original index.css initially. Extract gradually into:
    - tokens (vars), base, layout (Mbg + canvas layers), typography (animation states), components (nav/loader/cursor), media, states, animations (keyframes only).
- **GL**: `GLProvider` (RAF + registry), `GLCanvas` (per-section overlay), `BackgroundCanvas`/`LoaderCanvas` (fullscreen). Raw OGL only.
- **GSAP**: `SplitTextNode` performs `.char > .f/.n` surgery on mount; timelines read from `gsap-manifest.json`.
- **IO**: `useIO` hook dispatches `anim:*` CustomEvents for section enter/leave; both DOM timelines and GL uniforms subscribe.