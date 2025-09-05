// next.config.mjs
import { withVelite } from 'velite/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'mdx'],
    experimental: {
        appDir: true,
        serverComponentsExternalPackages: ['ogl', 'react-ogl', 'gsap', 'zustand'],
        turbo: {
            loaders: {
                '.glsl': ['raw-loader'],
                '.vert': ['raw-loader'],
                '.frag': ['raw-loader'],
            },
        },
    },
};

export default withVelite(nextConfig);
