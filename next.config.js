/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: false, // Let Next.js optimize images
    domains: [], // Add your image domains here if needed
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          }
        ],
      }
    ]
  },
  experimental: {
    workerThreads: true,
    optimizeCss: true,
  }
}

module.exports = nextConfig
