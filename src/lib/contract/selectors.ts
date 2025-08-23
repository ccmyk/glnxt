// src/lib/contract/selectors.ts
// Single source of truth for CSS hooks.
// If CSS classnames change later, update here (not across components).
export const Sel = {
    grid: {
        mbg: 'Mbg',
    },
    gl: {
        bgId: 'glBg',
        loaderId: 'glLoader',
        canvas: 'canvas',       // shared class for canvases
    },
    text: {
        write: 'Awrite',        // DOM split / write
        line: 'Aline',          // line-based
        title: 'Atitle',        // titles that share transitions
        char: 'char',
        real: 'n',
        fake: 'f',
        marker: 'iO',
    },
    state: {
        staged: 'stview',
        inview: 'inview',
        active: 'act',
        loaded: 'Ldd',
        iv: 'ivi',
    },
    nav: {
        root: 'nav',
        blur: 'nav_blur',
    },
    mouse: {
        root: 'mouse',
        el:   'mouse_el',
    },
} as const;