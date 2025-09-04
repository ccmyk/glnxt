// next.config.mjs
import { withVelite } from 'velite/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'mdx'], // allow MDX pages if needed
};

export default withVelite(nextConfig);
