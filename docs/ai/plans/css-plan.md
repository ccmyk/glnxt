# CSS Plan (hybrid)

1) Import full legacy CSS first (zero drift).
2) Extract in this order: tokens → base → layout (Mbg/canvas layers) → typography (state classes) → components (nav/loader/cursor) → media → states → animations (keyframes only).
3) Keep original classnames; no Tailwind.
4) Gate every extraction with before/after screenshots.