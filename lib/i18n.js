import { useRouter } from 'next/router';

export const LOCALES = ['fr', 'en'];
export const DEFAULT_LOCALE = 'fr';

/** Locale courante normalisée ('fr' | 'en'), 'default' est traité comme 'fr'. */
export function useLocale() {
  const { locale } = useRouter();
  return locale === 'en' ? 'en' : 'fr';
}

/** Retourne la branche du dictionnaire correspondant à la locale courante (fallback fr). */
export function useT(dict) {
  const locale = useLocale();
  return dict[locale] || dict[DEFAULT_LOCALE];
}

/**
 * Duplique les chemins d'un getStaticPaths pour chaque locale publique.
 * Sans cela, /fr/... et /en/... renverraient 404 avec fallback: false.
 */
export function localizePaths(paths) {
  return LOCALES.flatMap((locale) => paths.map((p) => ({ ...p, locale })));
}

/* ── Dictionnaire UI global (header, footer, éléments communs) ────────── */

export const UI = {
  fr: {
    topbar: {
      before: '🧪 Sélection éditoriale, ',
      bold: '134 outils analysés',
      after: ' et des fiches mises à jour régulièrement',
      cta: 'Voir la sélection →',
      close: 'Fermer',
    },
    nav: {
      home: 'Accueil',
      tools: 'Outils',
      allTools: 'Tous les outils',
      exploreAll: 'Explorer la sélection complète',
      categories: 'Catégories',
      comparisons: 'Comparatifs',
      quiz: 'Quiz',
      blog: 'Blog',
      methodology: 'Méthodologie',
      newsletter: 'Newsletter',
      contact: 'Contact',
      partners: 'Partenaires',
      top10: 'Top 10',
      byCategory: 'Par catégorie',
      exploreTools: '⚡ Explorer les outils',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
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
      toolsTitle: 'Outils',
      top10Title: 'Top 10',
      legalTitle: 'Légal',
      legalNotice: 'Mentions légales',
      terms: 'CGU',
      contact: 'Contact',
      partners: 'Partenaires',
      comparisons: 'Comparatifs',
      blog: 'Blog',
      methodology: 'Méthodologie',
      rights: 'Tous droits réservés.',
    },
    common: {
      lastUpdated: 'Dernière mise à jour',
      readMore: 'En savoir plus',
    },
    tool: {
      verified: 'Vérifié',
      freeTrial: 'Essai gratuit',
      reviews: 'avis',
      viewProfile: 'Voir la fiche',
      compare: 'Comparer',
      officialSite: 'Site officiel',
      starsAria: (v) => `${v} étoiles sur 5`,
      logoAlt: (name) => `Logo ${name}`,
      defaultCatLabel: 'Outil',
      strengths: 'Points forts',
      weaknesses: 'Limites',
      verdict: 'Notre verdict',
    },
    catLabels: {
      'VPN': 'VPN',
      'IA': 'IA',
      'Hébergement': 'Hébergement',
      'Antivirus': 'Antivirus',
      'Cybersécurité': 'Cybersécurité',
      'IA Générative': 'IA Générative',
    },
  },
  en: {
    topbar: {
      before: '🧪 Editorial selection, ',
      bold: '134 tools analyzed',
      after: ' with regularly updated reviews',
      cta: 'Browse the selection →',
      close: 'Close',
    },
    nav: {
      home: 'Home',
      tools: 'Tools',
      allTools: 'All tools',
      exploreAll: 'Explore the full selection',
      categories: 'Categories',
      comparisons: 'Comparisons',
      quiz: 'Quiz',
      blog: 'Blog',
      methodology: 'Methodology',
      newsletter: 'Newsletter',
      contact: 'Contact',
      partners: 'Partners',
      top10: 'Top 10',
      byCategory: 'By category',
      exploreTools: '⚡ Explore the tools',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
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
      toolsTitle: 'Tools',
      top10Title: 'Top 10',
      legalTitle: 'Legal',
      legalNotice: 'Legal notice',
      terms: 'Terms of use',
      contact: 'Contact',
      partners: 'Partners',
      comparisons: 'Comparisons',
      blog: 'Blog',
      methodology: 'Methodology',
      rights: 'All rights reserved.',
    },
    common: {
      lastUpdated: 'Last updated',
      readMore: 'Learn more',
    },
    tool: {
      verified: 'Verified',
      freeTrial: 'Free trial',
      reviews: 'reviews',
      viewProfile: 'View details',
      compare: 'Compare',
      officialSite: 'Official site',
      starsAria: (v) => `${v} stars out of 5`,
      logoAlt: (name) => `${name} logo`,
      defaultCatLabel: 'Tool',
      strengths: 'Strengths',
      weaknesses: 'Limitations',
      verdict: 'Our verdict',
    },
    catLabels: {
      'VPN': 'VPN',
      'IA': 'AI',
      'Hébergement': 'Hosting',
      'Antivirus': 'Antivirus',
      'Cybersécurité': 'Cybersecurity',
      'IA Générative': 'Generative AI',
    },
  },
};

/**
 * Texte d'une fiche outil dans la locale demandée.
 * Les traductions anglaises vivront sous `tool.en.<champ>` dans tools.json
 * (ajoutées par lots) ; tant qu'elles n'existent pas, on retombe sur le français.
 */
export function pickToolText(tool, locale, field) {
  if (locale === 'en' && tool?.en && tool.en[field] != null) return tool.en[field];
  return tool?.[field];
}

/** Raccourci : branche UI de la locale courante. */
export function useUI() {
  return useT(UI);
}
