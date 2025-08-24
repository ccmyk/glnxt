// next.config.mjs
import createMDX from '@next/mdx'

const withMDX = createMDX({
    options: {
        // add remark/rehype plugins here if you like
        // remarkPlugins: [], rehypePlugins: []
    }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'mdx'], // allow MDX pages if needed
}

export default withMDX(nextConfig)