/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimisation images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'comparateur-tech.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Note: scrollRestoration supprimé (retiré de Next.js 14)
  experimental: {
    optimizeCss: false,
    cpus: 1,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Regex corrigée : alternance (png|jpg|...) au lieu de {png,jpg,...}
        source: '/(.*)\\.{0,1}(png|jpg|jpeg|gif|webp|avif|ico|svg|woff2|woff|ttf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/data/(.*)\\.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/_next/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/en',        destination: '/',          permanent: false },
      { source: '/en/:path*', destination: '/:path*',    permanent: false },
      { source: '/fr',        destination: '/',          permanent: true  },
      { source: '/fr/:path*', destination: '/:path*',    permanent: true  },
      { source: '/outils/',   destination: '/outils',    permanent: true  },
      { source: '/blog/',     destination: '/blog',      permanent: true  },
    ];
  },

  env: {
    SITE_URL: process.env.SITE_URL || 'https://comparateur-tech.com',
  },
};

module.exports = nextConfig;
