const legacyInternalRedirects = [
  ['/comparatifs/meilleurs-vpn', '/comparatifs/meilleur-vpn'],
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

// ── Content-Security-Policy ──────────────────────────────────────────────────
// script-src SANS 'unsafe-inline' : le pages router n'émet aucun script inline
// exécutable (JSON-LD = bloc de données, __NEXT_DATA__ = application/json) et
// nos bootstraps GA / tracker sont externalisés dans public/js/. Seul
// 'unsafe-inline' de style-src subsiste (styles inline React / Tailwind).
// Domaines autorisés : GA4 (googletagmanager/google-analytics), Umami,
// taap.it, Supabase (tracker custom), Google Fonts, Google AdSense (prévu),
// vercel.live (widget des previews Vercel).
// En développement, Next (HMR / React Refresh) a besoin de 'unsafe-eval' + 'unsafe-inline'
// et upgrade-insecure-requests casse les assets http://localhost. On assouplit donc la CSP
// UNIQUEMENT en dev ; en production la CSP reste stricte (identique à avant).
const isDev = process.env.NODE_ENV !== 'production';

const ContentSecurityPolicy = [
  "default-src 'self'",
  // Pas de 'unsafe-inline' en prod : tous les scripts du site sont externes (les bootstraps
  // GA et tracker sont servis depuis /js/, voir public/js/). Une injection XSS ne
  // peut donc exécuter aucun script inline ni charger de script hors liste blanche.
  // En dev seulement : 'unsafe-eval' + 'unsafe-inline' pour le HMR / React Refresh.
  "script-src 'self'" +
    (isDev ? " 'unsafe-eval' 'unsafe-inline'" : '') +
    " https://www.googletagmanager.com https://www.google-analytics.com https://cloud.umami.is https://taap.it https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://tpc.googlesyndication.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  // En dev, autorise le websocket HMR de Next (ws://localhost).
  "connect-src 'self'" +
    (isDev ? ' ws: http://localhost:* http://127.0.0.1:*' : '') +
    " https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://stats.g.doubleclick.net https://cloud.umami.is https://api-gateway.umami.dev https://taap.it https://*.taap.it https://*.supabase.co https://pagead2.googlesyndication.com https://vercel.live wss://*.pusher.com",
  "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://vercel.live",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  // upgrade-insecure-requests casserait http://localhost en dev : prod uniquement.
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const decisionPageRedirects = [
  ['/chatgpt-vs-claude', '/comparatifs/chatgpt-vs-claude'],
  ['/chatgpt-vs-gemini', '/comparatifs/chatgpt-vs-gemini'],
  ['/cursor-vs-github-copilot', '/comparatifs/cursor-vs-github-copilot'],
  ['/nordvpn-vs-surfshark', '/comparatifs/nordvpn-vs-surfshark'],
  ['/nordvpn-vs-expressvpn', '/comparatifs/nordvpn-vs-expressvpn'],
  ['/hostinger-vs-o2switch', '/comparatifs/hostinger-vs-o2switch'],
  ['/bitdefender-vs-norton', '/comparatifs/bitdefender-vs-norton'],
  ['/alternatives-chatgpt', '/alternatives/alternative-chatgpt'],
  ['/alternatives-claude', '/alternatives/alternative-claude'],
  ['/alternatives-nordvpn', '/alternatives/alternative-nordvpn'],
  ['/alternatives-hostinger', '/alternatives/alternative-hostinger'],
  ['/alternatives-bitdefender', '/alternatives/alternative-bitdefender'],
  ['/meilleurs-outils-ia-pour-developpeurs', '/guides/meilleurs-outils-ia-pour-developpeurs'],
  ['/meilleurs-outils-ia-pour-etudiants', '/guides/meilleurs-outils-ia-pour-etudiants'],
  ['/meilleur-vpn-streaming', '/guides/meilleur-vpn-streaming'],
  ['/meilleur-hebergement-wordpress', '/guides/meilleur-hebergement-wordpress'],
  ['/meilleur-antivirus-windows', '/guides/meilleur-antivirus-windows'],
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

  // Bilingue FR/EN. La locale 'default' est technique : le middleware la redirige
  // en 301 vers /fr. Toutes les URLs publiques sont donc préfixées /fr ou /en.
  i18n: {
    locales: ['default', 'fr', 'en'],
    defaultLocale: 'default',
    localeDetection: false,
  },

  // Racine explicite du projet : évite que Next remonte au package-lock.json
  // parasite du dossier home pour le tracing des fichiers.
  outputFileTracingRoot: __dirname,

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
    // Tree-shaking fin des icônes lucide-react, bundle JS plus léger.
    optimizePackageImports: ['lucide-react'],
  },

  async headers() {
    // CSP stricte (script-src sans 'unsafe-inline') + en-têtes de durcissement.
    // Si un script tiers est ajouté un jour, il doit être chargé via src= depuis
    // une origine ajoutée à la liste blanche, jamais en inline.
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
          // preload : rend le domaine éligible à la liste HSTS preload des navigateurs
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // strict-* : n'envoie que l'origine en cross-origin et rien en cas de
          // rétrogradation HTTPS → HTTP (l'ancienne valeur fuitait le referrer complet en HTTP).
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
          // Isole la fenêtre des popups cross-origin (anti reverse-tabnabbing)
          // sans casser les liens affiliés target=_blank.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          // 0 = désactive l'ancien filtre XSS des navigateurs (lui-même vecteur
          // de fuites) ; la protection XSS moderne passe par la CSP.
          { key: 'X-XSS-Protection', value: '0' },
          // Interdit à Flash/PDF hérités de lire des données cross-domain.
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
        ],
      },
      {
        // Les réponses API (chatbot) ne doivent jamais être mises en cache ni indexées.
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
      {
        // Les fichiers de données JSON ne doivent jamais apparaître dans l'index
        // Google (complément du Disallow robots.txt, qui ne bloque que le crawl).
        source: '/data/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex' },
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
      ...decisionPageRedirects,
      ...legacyInternalRedirects,
      { source: '/en',        destination: '/',          permanent: true  },
      { source: '/en/:path*', destination: '/:path*',    permanent: true  },
      { source: '/fr',        destination: '/',          permanent: true  },
      { source: '/fr/:path*', destination: '/:path*',    permanent: true  },
      { source: '/outils/',   destination: '/outils',    permanent: true  },
      { source: '/blog/',     destination: '/blog',      permanent: true  },
    ];
  },

};

module.exports = nextConfig;
