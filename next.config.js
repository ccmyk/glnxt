/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      loaders: {
        '.glsl': ['raw-loader'],
        '.vert': ['raw-loader'],
        '.frag': ['raw-loader'],
      },
    },
  },
};

module.exports = nextConfig;

