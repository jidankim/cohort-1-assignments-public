/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // For Cloudflare Workers/Edge compatibility, avoid node-specific polyfills
    experimental: {
        runtime: 'edge'
    }
}

module.exports = nextConfig


