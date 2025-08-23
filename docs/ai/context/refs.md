# References (local & GitHub)

> Purpose: give AI/IDE an index of *where truth lives* without implying a 1:1 refactor. Use these only to **understand behavior** and extract timings; do not copy structure blindly.

## Local
- Root: `~/development/vanilla-js-source`
- Src subtree:
    - `wp-content/themes/src/`                         (source root)
    - `wp-content/themes/src/gl🌊🌊🌊/`                (OGL families)
    - `wp-content/themes/src/main🐙🐙🐙/`              (GSAP choreography, text logic)
    - `wp-content/themes/src/js🧠🧠🧠/page👁️/`         (page orchestration)
    - `wp-content/themes/src/views👁️👁️👁️/`             (views/sections)
    - `wp-content/themes/src/components🦾🦾🦾/`        (Nav, Mouse, Loader)
    - `wp-content/themes/src/start🏁🏁🏁/`             (bootstrap)
    - `wp-content/themes/src/ios⛓️⛓️⛓️/`               (lazy media)
- CSS (7k+): `wp-content/themes/csskiller_wp/index.css`

## Source Repos
- vanilla root: https://github.com/ccmyk/vanilla-js-source
- source root: https://github.com/ccmyk/vanilla-js-source/tree/main/wp-content/themes/src
- OGL families: https://github.com/ccmyk/vanilla-js-source/tree/main/wp-content/themes/src/gl🌊🌊🌊
- GSAP choreography, text logic: https://github.com/ccmyk/vanilla-js-source/tree/main/wp-content/themes/src/main🐙🐙🐙
- Nav, Mouse, Loader: https://github.com/ccmyk/vanilla-js-source/tree/main/wp-content/themes/src/components🦾🦾🦾
- bootstrap: https://github.com/ccmyk/vanilla-js-source/tree/main/wp-content/themes/src/start🏁🏁🏁
- page orchestration: https://github.com/ccmyk/vanilla-js-source/tree/main/wp-content/themes/src/js🧠🧠🧠/page👁️
- views/sections: https://github.com/ccmyk/vanilla-js-source/tree/main/wp-content/themes/src/views👁️👁️👁️
- lazy media: https://github.com/ccmyk/vanilla-js-source/tree/main/wp-content/themes/src/ios⛓️⛓️⛓️
- CSS index: https://github.com/ccmyk/vanilla-js-source/blob/main/wp-content/themes/csskiller_wp/index.css

## OGL Families
- 💬 tt/ (text/MSDF)
- 🔥 foot/ (footer variant)
- 👩‍⚖️ about/ (about text variant)
- 🖼️ default/ (image planes)
- 🎞️ slider/ (slideshow/distort)
- 🎢 roll/ (rolling media)
- 🏜️ bg/ (background planes)
- ⌛️ loader/ (overlay loader)
- 🧮 pg/pgel/ (playground)

Each = `base.js` (init/render), `position.js` (IO on/off).