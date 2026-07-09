import { DECISION_PAGES } from './decision-pages';

const BASE_URL = 'https://comparateur-tech.com';

// Duels couverts par une page éditoriale /comparatifs/<slug> : les liens et
// canonicals programmatiques pointent vers elle pour éviter le contenu
// dupliqué et concentrer l'autorité sur la version éditoriale.
const DECISION_COMPARISON_BY_PAIR = new Map(
  Object.values(DECISION_PAGES)
    .filter(page => page.type === 'comparison' && page.canonicalPath && (page.toolIds || []).length === 2)
    .map(page => [[...page.toolIds].map(slugify).sort().join('::'), page.canonicalPath])
);

function getDecisionComparisonPath(toolA, toolB) {
  return DECISION_COMPARISON_BY_PAIR.get([getToolSlug(toolA), getToolSlug(toolB)].sort().join('::')) || null;
}

export const USECASE_PAGES = [
  {
    slug: 'ia-pour-seo',
    title: 'Meilleurs outils IA pour SEO',
    category: 'Intelligence artificielle',
    keywords: ['seo', 'content', 'redaction', 'search', 'marketing'],
    preferredIds: ['chatgpt', 'claude-ai', 'perplexity', 'gemini', 'mistral-ai'],
    criteria: ['qualité rédactionnelle', 'recherche et sources', 'analyse de mots-clés', 'production à grande échelle', 'contrôle éditorial'],
  },
  {
    slug: 'ia-pour-etudiants',
    title: 'Meilleurs outils IA pour étudiants',
    category: 'Intelligence artificielle',
    keywords: ['study', 'student', 'education', 'research', 'translate'],
    preferredIds: ['chatgpt', 'claude-ai', 'perplexity', 'notion-ai', 'deepl', 'gemini'],
    criteria: ['résumé de cours', 'recherche fiable', 'rédaction', 'traduction', 'plan gratuit'],
  },
  {
    slug: 'ia-pour-developpeurs',
    title: 'Meilleurs outils IA pour développeurs',
    category: 'Intelligence artificielle',
    keywords: ['code', 'developer', 'api', 'coding', 'copilot'],
    preferredIds: ['cursor', 'github-copilot', 'openai-api', 'anthropic-api', 'mistral-ai', 'replit'],
    criteria: ['complétion de code', 'contexte projet', 'refactorisation', 'API', 'coût d’usage'],
  },
  {
    slug: 'vpn-streaming',
    title: 'Meilleurs VPN pour streaming',
    category: 'VPN',
    keywords: ['streaming', 'netflix', 'video', 'tv'],
    preferredIds: ['nordvpn', 'surfshark', 'expressvpn', 'cyberghost-vpn', 'proton-vpn', 'mullvad-vpn'],
    criteria: ['vitesse', 'stabilité', 'applications TV', 'pays disponibles', 'prix'],
  },
  {
    slug: 'vpn-confidentialite',
    title: 'Meilleurs VPN pour confidentialité',
    category: 'VPN',
    keywords: ['privacy', 'confidentialite', 'security', 'no-log'],
    preferredIds: ['proton-vpn', 'mullvad-vpn', 'nordvpn', 'expressvpn', 'surfshark'],
    criteria: ['politique no-log', 'juridiction', 'chiffrement', 'audit indépendant', 'paiement anonyme'],
  },
  {
    slug: 'hebergement-wordpress',
    title: 'Meilleurs hébergements WordPress',
    category: 'Hébergement web',
    keywords: ['wordpress', 'hosting', 'site', 'blog'],
    preferredIds: ['hostinger', 'o2switch', 'siteground', 'kinsta', 'wp-engine', 'infomaniak'],
    criteria: ['vitesse', 'support', 'sauvegardes', 'simplicité WordPress', 'évolutivité'],
  },
  {
    slug: 'antivirus-windows',
    title: 'Meilleurs antivirus Windows',
    category: 'Antivirus',
    keywords: ['windows', 'malware', 'ransomware', 'security'],
    preferredIds: ['bitdefender', 'norton360', 'eset-nod32', 'avast', 'malwarebytes', 'kaspersky'],
    criteria: ['détection malware', 'impact performance', 'anti-phishing', 'ransomware', 'prix'],
  },
  {
    slug: 'cybersecurite-pme',
    title: 'Meilleurs outils cybersécurité pour PME',
    category: 'Cybersécurité',
    keywords: ['password', 'auth', 'siem', 'vulnerability', 'security'],
    preferredIds: ['1password', 'bitwarden', 'authy', 'crowdsec', 'wireshark', 'malwarebytes'],
    criteria: ['risque couvert', 'déploiement', 'alertes', 'support équipe', 'coût opérationnel'],
  },
  {
    slug: 'gestionnaire-mots-de-passe',
    title: 'Meilleurs gestionnaires de mots de passe',
    category: 'Cybersécurité',
    keywords: ['password', 'mots de passe', 'vault', 'coffre', 'secrets'],
    preferredIds: ['bitwarden', '1password', 'lastpass', 'dashlane', 'keepass', 'hashicorp-vault'],
    criteria: ['sécurité du coffre', 'partage en équipe', 'autofill', 'audit des mots de passe', 'prix'],
  },
];

const SEO_CLUSTER_COMPARISONS = [
  ['bitwarden', '1password'],
  ['bitwarden', 'lastpass'],
  ['bitwarden', 'dashlane'],
  ['ovhcloud', 'hostinger'],
  ['ovhcloud', 'o2switch'],
  ['ovhcloud', 'infomaniak'],
  ['openai-api', 'anthropic-api'],
];

export const CORE_CATEGORY_SLUGS = {
  'Intelligence artificielle': 'intelligence-artificielle',
  'IA générative': 'intelligence-artificielle',
  VPN: 'vpn',
  'Hébergement web': 'hebergement-web',
  Antivirus: 'antivirus',
  'Cybersécurité': 'cybersecurite',
};

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cleanText(text) {
  return String(text || '')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getToolSlug(tool) {
  return slugify(tool?.slug || tool?.id || tool?.name);
}

export function getToolPath(tool) {
  return `/tool/${tool.id}`;
}

export function getAlternativePath(tool) {
  return `/alternatives/${getToolSlug(tool)}`;
}

export function getCategorySlug(category) {
  return CORE_CATEGORY_SLUGS[category] || slugify(category);
}

export function getCategoryPath(category) {
  const slug = getCategorySlug(category);
  return slug ? `/outils/${slug}` : '/outils';
}

export function primaryCategory(tool) {
  return tool?.categories?.[0] || 'outil tech';
}

export function getToolBySlug(tools, slug) {
  const normalizedSlug = slugify(slug);
  return tools.find(tool => getToolSlug(tool) === normalizedSlug || slugify(tool.id) === normalizedSlug) || null;
}

export function hasUsefulToolData(tool) {
  return Boolean(tool?.id && tool?.name && (tool.short || tool.highlight || tool.description) && tool.categories?.length);
}

function sharedCategories(a, b) {
  const left = new Set((a.categories || []).map(slugify));
  return (b.categories || []).filter(category => left.has(slugify(category))).length;
}

function searchableText(tool) {
  return cleanText([
    tool.id,
    tool.slug,
    tool.name,
    tool.short,
    tool.highlight,
    ...(tool.categories || []),
    ...(tool.tags || []),
    ...(tool.strengthShort || []),
    ...(tool.idealFor || []),
  ].filter(Boolean).join(' ')).toLowerCase();
}

export function getRelatedTools(tools, tool, limit = 6) {
  if (!hasUsefulToolData(tool)) return [];
  return tools
    .filter(candidate => candidate.id !== tool.id && hasUsefulToolData(candidate) && sharedCategories(tool, candidate) > 0)
    .map(candidate => ({
      tool: candidate,
      score:
        sharedCategories(tool, candidate) * 100 +
        (candidate.featured ? 12 : 0) +
        (candidate.verified ? 8 : 0) +
        ((candidate.rating?.value || 0) * 5) +
        ((candidate.strengthShort || candidate.strengths || []).length ? 3 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name, 'fr'))
    .slice(0, limit)
    .map(item => item.tool);
}

export function isAlternativePageIndexable(tools, tool) {
  return hasUsefulToolData(tool) && getRelatedTools(tools, tool, 3).length >= 3;
}

export function getIndexableAlternativeUrls(tools) {
  const usefulTools = tools.filter(hasUsefulToolData);
  const categoryCounts = usefulTools.reduce((counts, tool) => {
    for (const category of tool.categories || []) {
      const key = slugify(category);
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, {});

  return tools
    .filter(tool => hasUsefulToolData(tool) && (tool.categories || []).some(category => (categoryCounts[slugify(category)] || 0) >= 4))
    .map(tool => getAlternativePath(tool));
}

export function getTopToolsByCategory(tools, category, limit = 12) {
  const categorySlug = slugify(category);
  return tools
    .filter(tool => hasUsefulToolData(tool) && (tool.categories || []).some(item => slugify(item) === categorySlug))
    .sort((a, b) => {
      const ratingDiff = (b.rating?.value || 0) - (a.rating?.value || 0);
      if (ratingDiff) return ratingDiff;
      return Number(Boolean(b.verified)) - Number(Boolean(a.verified)) || a.name.localeCompare(b.name, 'fr');
    })
    .slice(0, limit);
}

export function getUsecaseBySlug(slug) {
  return USECASE_PAGES.find(page => page.slug === slug) || null;
}

export function getUsecaseTools(tools, usecase, limit = 8) {
  if (!usecase) return [];
  const picked = [];
  const seen = new Set();

  for (const id of usecase.preferredIds || []) {
    const tool = tools.find(item => item.id === id || getToolSlug(item) === slugify(id));
    if (hasUsefulToolData(tool) && !seen.has(tool.id)) {
      picked.push(tool);
      seen.add(tool.id);
    }
  }

  const keywordMatches = tools
    .filter(tool => hasUsefulToolData(tool) && !seen.has(tool.id))
    .filter(tool => (tool.categories || []).includes(usecase.category))
    .map(tool => {
      const haystack = searchableText(tool);
      const keywordScore = (usecase.keywords || []).filter(keyword => haystack.includes(slugify(keyword))).length;
      return { tool, score: keywordScore * 40 + (tool.rating?.value || 0) * 4 + (tool.verified ? 5 : 0) };
    })
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name, 'fr'));

  for (const item of keywordMatches) {
    if (picked.length >= limit) break;
    if (!seen.has(item.tool.id)) {
      picked.push(item.tool);
      seen.add(item.tool.id);
    }
  }

  return picked.slice(0, limit);
}

function pairSlug(toolA, toolB) {
  return `${getToolSlug(toolA)}-vs-${getToolSlug(toolB)}`;
}

function getSeoClusterComparison(toolA, toolB) {
  const slugs = new Set([getToolSlug(toolA), getToolSlug(toolB)]);
  return SEO_CLUSTER_COMPARISONS.find(([left, right]) => slugs.has(left) && slugs.has(right)) || null;
}

export function getComparisonPath(toolA, toolB) {
  const decisionPath = getDecisionComparisonPath(toolA, toolB);
  if (decisionPath) return decisionPath;

  const seoClusterComparison = getSeoClusterComparison(toolA, toolB);
  if (seoClusterComparison) {
    return `/comparatif/${seoClusterComparison[0]}-vs-${seoClusterComparison[1]}`;
  }

  const [left, right] = [toolA, toolB].sort((a, b) => getToolSlug(a).localeCompare(getToolSlug(b)));
  return `/comparatif/${pairSlug(left, right)}`;
}

export function getComparisonPairs(tools) {
  const categories = ['Intelligence artificielle', 'VPN', 'Hébergement web', 'Antivirus', 'Cybersécurité'];
  const pairs = [];
  const seen = new Set();

  for (const [leftSlug, rightSlug] of SEO_CLUSTER_COMPARISONS) {
    const toolA = getToolBySlug(tools, leftSlug);
    const toolB = getToolBySlug(tools, rightSlug);
    if (!hasUsefulToolData(toolA) || !hasUsefulToolData(toolB) || sharedCategories(toolA, toolB) === 0) continue;
    // Duel couvert par une page éditoriale : déjà présent dans le sitemap via DECISION_PAGE_CANONICAL_PATHS.
    if (getDecisionComparisonPath(toolA, toolB)) continue;

    const key = getComparisonPath(toolA, toolB);
    seen.add(key);
    pairs.push({
      slug: key.replace('/comparatif/', ''),
      path: key,
      toolA,
      toolB,
      category: (toolA.categories || []).find(category => (toolB.categories || []).map(slugify).includes(slugify(category))) || primaryCategory(toolA),
    });
  }

  for (const category of categories) {
    const categoryTools = getTopToolsByCategory(tools, category, category === 'Intelligence artificielle' ? 12 : 10);
    for (let i = 0; i < categoryTools.length; i += 1) {
      for (let j = i + 1; j < categoryTools.length; j += 1) {
        const a = categoryTools[i];
        const b = categoryTools[j];
        if (getDecisionComparisonPath(a, b)) continue;
        const key = getComparisonPath(a, b);
        if (!seen.has(key) && sharedCategories(a, b) > 0) {
          seen.add(key);
          pairs.push({ slug: key.replace('/comparatif/', ''), path: key, toolA: a, toolB: b, category });
        }
      }
    }
  }

  return pairs;
}

export function getComparisonBySlug(tools, slug) {
  const indexedPair = getComparisonPairs(tools).find(pair => pair.slug === slug);
  if (indexedPair) return indexedPair;

  const candidates = tools.filter(hasUsefulToolData);
  for (const toolA of candidates) {
    const left = `${getToolSlug(toolA)}-vs-`;
    if (!slug.startsWith(left)) continue;
    const rightSlug = slug.slice(left.length);
    const toolB = candidates.find(tool => getToolSlug(tool) === rightSlug);
    if (!toolB || toolA.id === toolB.id || sharedCategories(toolA, toolB) === 0) continue;
    return {
      slug,
      path: getComparisonPath(toolA, toolB),
      toolA,
      toolB,
      category: (toolA.categories || []).find(category => (toolB.categories || []).map(slugify).includes(slugify(category))) || primaryCategory(toolA),
    };
  }

  return null;
}

export function buildFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: `${BASE_URL}${item.url}` } : {}),
    })),
  };
}

export function buildItemListSchema(name, description, tools) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: `${BASE_URL}${getToolPath(tool)}`,
    })),
  };
}
