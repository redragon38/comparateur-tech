import { useRouter } from 'next/router';

export const LOCALES = ['fr', 'en'];
export const DEFAULT_LOCALE = 'fr';

/** Locale courante normalisée ('fr' | 'en'). 'default' est traité comme 'fr'. */
export function useLocale() {
  const { locale } = useRouter();
  return locale === 'en' ? 'en' : 'fr';
}

/** Branche du dictionnaire pour la locale courante (fallback fr). */
export function useT(dict) {
  const locale = useLocale();
  return dict[locale] || dict[DEFAULT_LOCALE];
}

/**
 * Duplique les chemins d'un getStaticPaths pour chaque locale publique.
 * Indispensable : sans ça, /fr/... et /en/... renverraient 404 (fallback: false).
 */
export function localizePaths(paths) {
  return LOCALES.flatMap((locale) => paths.map((p) => ({ ...p, locale })));
}

/**
 * Texte localisé d'un outil. Les données du site stockent l'anglais en CLÉS PLATES
 * "en.<champ>" (ex: tool["en.short"]). On lit cette clé en EN, sinon on retombe sur le FR.
 * Gère aussi le format imbriqué tool.en.<champ> au cas où.
 */
export function pickToolText(tool, locale, field) {
  if (!tool) return undefined;
  if (locale === 'en') {
    const flat = tool[`en.${field}`];
    if (flat != null) return flat;
    if (tool.en && tool.en[field] != null) return tool.en[field];
  }
  return tool[field];
}

// Champs traduisibles d'un outil (mêmes clés que le script/lib de traduction).
const LOCALIZABLE_TOOL_FIELDS = [
  'short', 'highlight', 'description', 'verdict',
  'strengths', 'strengthShort', 'limitations', 'limitationsShort', 'idealFor', 'notFor', 'tags',
  'article', 'faq', 'readMore', 'categories',
];

/**
 * Renvoie une copie de l'outil dont les champs FR sont remplacés par leur version EN
 * quand elle existe (clés plates en.* ou imbriqué en.<champ>). En FR : renvoie l'outil tel quel.
 *
 * Astuce : ça permet au rendu existant (qui lit tool.short, tool.verdict, ...) d'afficher
 * l'anglais sans réécrire tout le composant. Les champs sans traduction restent en FR.
 */
export function applyLocale(tool, locale) {
  if (!tool || locale !== 'en') return tool;
  const out = { ...tool };
  for (const f of LOCALIZABLE_TOOL_FIELDS) {
    const flat = tool[`en.${f}`];
    if (flat != null) { out[f] = flat; continue; }
    if (tool.en && tool.en[f] != null) out[f] = tool.en[f];
  }
  return out;
}

// ── Dictionnaire d'interface partagé (chrome : Header, Footer, topbar) ──────────
// Chaque page peut aussi définir son propre dict local + useT(dict).
export const UI = {
  fr: {
    topbar: {
      before: 'Sélection éditoriale, ',
      bold: '100+ outils analysés',
      after: ' pour choisir plus vite',
      cta: 'Voir la sélection →',
      close: 'Fermer',
    },
    nav: {
      home: 'Accueil', tools: 'Outils', allTools: 'Tous les outils',
      exploreAll: 'Explorer la sélection complète', categories: 'Catégories',
      comparisons: 'Comparatifs', blog: 'Blog', methodology: 'Méthodologie',
      newsletter: 'Newsletter', contact: 'Contact', partners: 'Partenaires',
      top10: 'Top 10', byCategory: 'Par catégorie', exploreTools: '⚡ Explorer les outils',
      usefulLinks: 'Liens utiles', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu',
    },
    categories: [
      { slug: 'intelligence-artificielle', label: 'Intelligence artificielle', icon: '🤖', desc: 'Outils IA pour la productivité', href: '/outils/intelligence-artificielle' },
      { slug: 'hebergement-web',           label: 'Hébergement web',           icon: '🌐', desc: 'Hébergez vos projets web', href: '/outils/hebergement-web' },
      { slug: 'vpn',                       label: 'VPN',                       icon: '🛡️', desc: 'Sécurisez vos connexions', href: '/outils/vpn' },
      { slug: 'antivirus',                 label: 'Antivirus',                 icon: '🦠', desc: 'Protégez vos appareils', href: '/outils/antivirus' },
      { slug: 'cybersecurite',             label: 'Cybersécurité',             icon: '🔐', desc: 'Renforcez votre sécurité numérique', href: '/outils/cybersecurite' },
    ],
    top10Categories: [
      { slug: 'intelligence-artificielle', label: 'IA', icon: '🤖' },
      { slug: 'hebergement-web',           label: 'Hébergement', icon: '🌐' },
      { slug: 'vpn',                       label: 'VPN', icon: '🛡️' },
      { slug: 'antivirus',                 label: 'Antivirus', icon: '🦠' },
      { slug: 'cybersecurite',             label: 'Cybersécurité', icon: '🔐' },
    ],
    footer: {
      tagline: 'La plateforme de référence pour découvrir et comparer les meilleurs outils du web.',
      contactAria: 'Contacter Comparateur-Tech',
      toolsTitle: 'Outils', allTools: 'Tous les outils',
      top10Title: 'Top 10', guidesTitle: 'Guides', linksTitle: 'Liens',
      contact: 'Contact', partners: 'Partenaires', comparisons: 'Comparatifs',
      blog: 'Blog', methodology: 'Méthodologie',
      legalNotice: 'Mentions légales', terms: 'CGU', affiliation: 'Affiliation', privacy: 'Confidentialité',
      rights: 'Tous droits réservés.',
      catAI: '🤖 IA', catVPN: '🛡️ VPN', catHost: '🌐 Hébergement', catAV: '🦠 Antivirus', catCyber: '🔐 Cybersécurité',
      top10AI: '🏆 Top 10 IA', top10VPN: '🏆 Top 10 VPN', top10Host: '🏆 Top 10 Hébergement', top10AV: '🏆 Top 10 Antivirus', top10Cyber: '🏆 Top 10 Cybersécurité',
      guideAltChatgpt: 'Alternatives ChatGPT', guideVpnStreaming: 'VPN streaming', guideWpHosting: 'Hébergement WordPress',
    },
    tool: {
      verified: 'Vérifié', freeTrial: 'Essai gratuit', officialSite: 'Site officiel',
      viewProfile: 'Voir la fiche', compare: 'Comparer', editorialRating: 'Note éditoriale',
      starsAria: (v) => `${v} étoiles sur 5`, logoAlt: (n) => `Logo ${n}`,
    },
    catLabels: {
      'VPN': 'VPN', 'IA': 'IA', 'Hébergement': 'Hébergement', 'Antivirus': 'Antivirus',
      'Cybersécurité': 'Cybersécurité', 'IA Générative': 'IA Générative', 'Outil': 'Outil',
    },
  },
  en: {
    topbar: {
      before: 'Editorial selection, ',
      bold: '100+ tools analyzed',
      after: ' to choose faster',
      cta: 'Browse the selection →',
      close: 'Close',
    },
    nav: {
      home: 'Home', tools: 'Tools', allTools: 'All tools',
      exploreAll: 'Explore the full selection', categories: 'Categories',
      comparisons: 'Comparisons', blog: 'Blog', methodology: 'Methodology',
      newsletter: 'Newsletter', contact: 'Contact', partners: 'Partners',
      top10: 'Top 10', byCategory: 'By category', exploreTools: '⚡ Explore the tools',
      usefulLinks: 'Useful links', openMenu: 'Open menu', closeMenu: 'Close menu',
    },
    categories: [
      { slug: 'intelligence-artificielle', label: 'Artificial intelligence', icon: '🤖', desc: 'AI tools for productivity', href: '/outils/intelligence-artificielle' },
      { slug: 'hebergement-web',           label: 'Web hosting',             icon: '🌐', desc: 'Host your web projects', href: '/outils/hebergement-web' },
      { slug: 'vpn',                       label: 'VPN',                     icon: '🛡️', desc: 'Secure your connections', href: '/outils/vpn' },
      { slug: 'antivirus',                 label: 'Antivirus',               icon: '🦠', desc: 'Protect your devices', href: '/outils/antivirus' },
      { slug: 'cybersecurite',             label: 'Cybersecurity',           icon: '🔐', desc: 'Strengthen your digital security', href: '/outils/cybersecurite' },
    ],
    top10Categories: [
      { slug: 'intelligence-artificielle', label: 'AI', icon: '🤖' },
      { slug: 'hebergement-web',           label: 'Hosting', icon: '🌐' },
      { slug: 'vpn',                       label: 'VPN', icon: '🛡️' },
      { slug: 'antivirus',                 label: 'Antivirus', icon: '🦠' },
      { slug: 'cybersecurite',             label: 'Cybersecurity', icon: '🔐' },
    ],
    footer: {
      tagline: 'The reference platform to discover and compare the best tools on the web.',
      contactAria: 'Contact Comparateur-Tech',
      toolsTitle: 'Tools', allTools: 'All tools',
      top10Title: 'Top 10', guidesTitle: 'Guides', linksTitle: 'Links',
      contact: 'Contact', partners: 'Partners', comparisons: 'Comparisons',
      blog: 'Blog', methodology: 'Methodology',
      legalNotice: 'Legal notice', terms: 'Terms of use', affiliation: 'Affiliate policy', privacy: 'Privacy',
      rights: 'All rights reserved.',
      catAI: '🤖 AI', catVPN: '🛡️ VPN', catHost: '🌐 Hosting', catAV: '🦠 Antivirus', catCyber: '🔐 Cybersecurity',
      top10AI: '🏆 Top 10 AI', top10VPN: '🏆 Top 10 VPN', top10Host: '🏆 Top 10 Hosting', top10AV: '🏆 Top 10 Antivirus', top10Cyber: '🏆 Top 10 Cybersecurity',
      guideAltChatgpt: 'ChatGPT alternatives', guideVpnStreaming: 'Streaming VPN', guideWpHosting: 'WordPress hosting',
    },
    tool: {
      verified: 'Verified', freeTrial: 'Free trial', officialSite: 'Official site',
      viewProfile: 'View details', compare: 'Compare', editorialRating: 'Editorial rating',
      starsAria: (v) => `${v} stars out of 5`, logoAlt: (n) => `${n} logo`,
    },
    catLabels: {
      'VPN': 'VPN', 'IA': 'AI', 'Hébergement': 'Hosting', 'Antivirus': 'Antivirus',
      'Cybersécurité': 'Cybersecurity', 'IA Générative': 'Generative AI', 'Outil': 'Tool',
    },
  },
};

/** Dictionnaire d'interface pour la locale courante (fallback fr). */
export function useUI() {
  const locale = useLocale();
  return UI[locale] || UI[DEFAULT_LOCALE];
}
