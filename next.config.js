const legacyInternalRedirects = [
  ['/comparatifs/meilleurs-vpn', '/top-10-vpn'],
  ['/comparisons/best-vpn', '/top-10-vpn'],
  ['/comparatif-vpn', '/top-10-vpn'],
  ['/vpn-comparatif', '/top-10-vpn'],
  ['/comparatif-vpn-2026', '/top-10-vpn'],
  ['/vpn-comparison', '/top-10-vpn'],
  ['/vpn-comparison-2026', '/top-10-vpn'],
  ['/vpn-security-comparison', '/top-10-vpn'],
  ['/comparatif-vpn-securite', '/top-10-vpn'],
  ['/guides/vpn', '/outils/vpn'],
  ['/guide-vpn-complet', '/outils/vpn'],
  ['/vpn-guide-complet', '/outils/vpn'],
  ['/complete-vpn-guide', '/outils/vpn'],
  ['/guides/vpn-streaming', '/blog/vpn-streaming-netflix'],
  ['/streaming/debloquer-contenus', '/blog/vpn-streaming-netflix'],
  ['/guides/protection-wifi-public', '/outils/vpn'],
  ['/guides/public-wifi-security', '/outils/vpn'],
  ['/guide-securite-internet', '/outils/vpn'],
  ['/internet-security-guide', '/outils/vpn'],
  ['/blog/confidentialite-en-ligne', '/outils/vpn'],
  ['/blog/securite-wifi-public', '/outils/vpn'],
  ['/vpn-anonymat-guide', '/outils/vpn'],
  ['/vpn-anonymity-guide', '/outils/vpn'],
  ['/securite/chiffrement', '/outils/vpn'],
  ['/securite/navigation-securisee', '/outils/vpn'],
  ['/securite/protection-donnees', '/outils/vpn'],
  ['/blog/meilleurs-antivirus', '/top-10-antivirus'],
  ['/blog/best-antivirus', '/top-10-antivirus'],
  ['/blog/antivirus-gratuit', '/blog/antivirus-gratuit-vs-payant'],
  ['/blog/free-antivirus', '/blog/antivirus-gratuit-vs-payant'],
  ['/categorie/intelligence-artificielle', '/outils/intelligence-artificielle'],
  ['/outils/gestion-de-projet', '/outils/intelligence-artificielle/productivite'],
  ['/tools/project-management', '/outils/intelligence-artificielle/productivite'],
  ['/guides/productivite-equipe', '/outils/intelligence-artificielle/productivite'],
  ['/guides/team-productivity', '/outils/intelligence-artificielle/productivite'],
  ['/guides/agents-ia', '/outils/intelligence-artificielle/agent'],
  ['/guides/ai-agents', '/outils/intelligence-artificielle/agent'],
  ['/comparatifs/outils-automation', '/outils/intelligence-artificielle/agent'],
  ['/comparatifs/alternatives-asana', '/outils/intelligence-artificielle/productivite'],
  ['/blog/cybersecurite-pme', '/top-10-cybersecurite'],
  ['/blog/cybersecurity-for-smb', '/top-10-cybersecurite'],
  ['/blog/protection-ransomware', '/top-10-cybersecurite'],
  ['/blog/ransomware-protection', '/top-10-cybersecurite'],
  ['/blog/cybersecurite-vie-privee', '/top-10-cybersecurite'],
  ['/blog/cybersecurity-privacy', '/top-10-cybersecurite'],
  ['/comparatifs/outils-pentesting', '/outils/cybersecurite'],
  ['/comparatifs/meilleurs-siem', '/outils/cybersecurite'],
  ['/guides/gestionnaire-mot-de-passe', '/outils/cybersecurite'],
  ['/guides/password-manager', '/outils/cybersecurite'],
  ['/guides/analyse-trafic-reseau', '/outils/cybersecurite'],
  ['/guides/test-intrusion-debutant', '/outils/cybersecurite'],
  ['/guides/securite-application-web', '/outils/cybersecurite'],
  ['/guides/bug-bounty-debutant', '/outils/cybersecurite'],
  ['/guides/scan-reseau-debutant', '/outils/cybersecurite'],
  ['/guides/devsecops-secrets', '/outils/cybersecurite'],
  ['/guides/installer-kali-linux', '/outils/cybersecurite'],
  ['/guides/certification-oscp', '/outils/cybersecurite'],
  ['/guides/ids-ips-entreprise', '/outils/cybersecurite'],
  ['/guides/scanner-vulnerabilites', '/outils/cybersecurite'],
  ['/guides/devsecops-shift-left', '/outils/cybersecurite'],
  ['/guides/creer-soc-entreprise', '/outils/cybersecurite'],
].map(([source, destination]) => ({ source, destination, permanent: true }));

const canonicalHostRedirects = [
  'comparateurtech.com',
  'www.comparateurtech.com',
  'www.comparateur-tech.com',
].map(host => ({
  source: '/:path*',
  has: [{ type: 'host', value: host }],
  destination: 'https://comparateur-tech.com/:path*',
  permanent: true,
}));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // La locale 'default' est technique : le middleware la redirige en 301 vers /fr.
  // Toutes les URLs publiques sont donc préfixées /fr ou /en.
  i18n: {
    locales: ['default', 'fr', 'en'],
    defaultLocale: 'default',
    localeDetection: false,
  },

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
    // Tree-shaking fin des icônes lucide-react → bundle JS plus léger, hydratation/LCP plus rapides.
    optimizePackageImports: ['lucide-react'],
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
          // HSTS : force HTTPS (durcissement sécurité).
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      {
        // Cache CDN des pages HTML : le edge sert une copie en ~quelques ms (TTFB bas),
        // stale-while-revalidate rafraîchit en arrière-plan. Exclut api, _next, le sitemap
        // et tous les fichiers à extension (assets, robots.txt…) qui ont leur propre cache.
        source: '/((?!api/|_next/|.*\\..*).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        // Cache long pour les assets statiques : le `.` est obligatoire,
        // sinon des URLs sans extension matchaient (ex: /page) et héritaient d'un cache immutable.
        source: '/:path*.(png|jpg|jpeg|gif|webp|avif|ico|svg|woff2|woff|ttf)',
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
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      ...canonicalHostRedirects,
      ...legacyInternalRedirects,
      { source: '/outils/',   destination: '/outils',    permanent: true  },
      { source: '/blog/',     destination: '/blog',      permanent: true  },
    ];
  },

  env: {
    SITE_URL: process.env.SITE_URL || 'https://comparateur-tech.com',
  },
};

module.exports = nextConfig;
