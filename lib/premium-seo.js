const BASE_URL = 'https://comparateur-tech.com';
const SITE_NAME = 'Comparateur-Tech';

export function hashSeed(value) {
  return String(value || '')
    .split('')
    .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

export function variant(items, seed, offset = 0) {
  if (!items.length) return null;
  return items[Math.abs(hashSeed(seed) + offset) % items.length];
}

export function text(value, fallback = '') {
  return String(value || fallback)
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function clampMeta(value, max) {
  const clean = text(value);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '').trim()}...`;
}

export function joinList(values, fallback = 'les criteres essentiels') {
  const clean = (values || []).map(item => text(item)).filter(Boolean);
  if (!clean.length) return fallback;
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(', ')} et ${clean[clean.length - 1]}`;
}

export const CATEGORY_PLAYBOOK = {
  VPN: {
    decision: ['vitesse', 'confidentialite', 'applications', 'serveurs', 'prix de renouvellement', 'support'],
    audiences: ['streaming', 'teletravail', 'Wi-Fi public', 'famille', 'voyage', 'PME'],
    pain: 'securiser la connexion sans perdre trop de vitesse',
  },
  Antivirus: {
    decision: ['protection temps reel', 'anti-phishing', 'impact performance', 'ransomware', 'controle parental', 'support'],
    audiences: ['Windows', 'Mac', 'famille', 'independant', 'PME', 'etudiant'],
    pain: 'reduire le risque malware sans alourdir la machine',
  },
  'Hebergement web': {
    decision: ['vitesse', 'support', 'sauvegardes', 'WordPress', 'scalabilite', 'prix de renouvellement'],
    audiences: ['site vitrine', 'e-commerce', 'blog', 'agence', 'freelance', 'PME'],
    pain: 'publier un site fiable avec un support reactif',
  },
  'Intelligence artificielle': {
    decision: ['qualite des reponses', 'confidentialite', 'integrations', 'API', 'limites du plan gratuit', 'cout usage'],
    audiences: ['createur de contenu', 'developpeur', 'etudiant', 'marketing', 'support client', 'equipe produit'],
    pain: 'gagner du temps sans perdre le controle editorial',
  },
  'IA generative': {
    decision: ['qualite creative', 'controle du rendu', 'droits usage', 'vitesse', 'credits', 'formats export'],
    audiences: ['design', 'video', 'social media', 'marketing', 'formation', 'prototype'],
    pain: 'produire plus vite des contenus reutilisables',
  },
  Cybersecurite: {
    decision: ['risque couvert', 'deploiement', 'alertes', 'integrations', 'cout operationnel', 'audit'],
    audiences: ['PME', 'equipe IT', 'DevSecOps', 'freelance', 'SOC', 'administrateur systeme'],
    pain: 'renforcer la securite sans complexifier les operations',
  },
};

export function categoryPlaybook(category) {
  const normalized = text(category)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const key = Object.keys(CATEGORY_PLAYBOOK).find(item => (
    item.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === normalized
  ));
  return CATEGORY_PLAYBOOK[key] || {
    decision: ['prix', 'fonctionnalites', 'support', 'integrations', 'prise en main', 'limites'],
    audiences: ['freelance', 'PME', 'createur', 'equipe produit', 'etudiant', 'developpeur'],
    pain: 'choisir un outil utile sans se fier uniquement a la notoriete',
  };
}

export function buildAlternativeSeoModel(tool, alternatives, category) {
  const seed = `alt:${tool.id}`;
  const playbook = categoryPlaybook(category);
  const title = clampMeta(variant([
    `Alternatives a ${tool.name} : classement, prix et meilleur choix`,
    `${tool.name} : les meilleures alternatives selon votre usage`,
    `Top alternatives a ${tool.name} pour comparer sans se tromper`,
    `Remplacer ${tool.name} : options serieuses, limites et verdict`,
  ], seed), 64);
  const description = clampMeta(variant([
    `Comparez ${tool.name} avec ${alternatives.length} alternatives : prix, cas d'usage, limites, criteres de choix et liens vers les comparatifs utiles.`,
    `Guide pratique pour choisir une alternative a ${tool.name} : tableau, classement, raisons de changer, raisons de rester et FAQ detaillee.`,
    `Selection d'alternatives a ${tool.name} pour ${joinList(playbook.audiences.slice(0, 3))}, avec verdict editorial et maillage vers les fiches outils.`,
  ], seed, 1), 158);
  const cta = variant([
    `Comparer ${tool.name} aux favoris`,
    `Voir le classement complet`,
    `Identifier le meilleur remplacement`,
    `Verifier les criteres avant de changer`,
  ], seed, 2);

  return { seed, title, description, cta, playbook };
}

export function buildAlternativeFaq(tool, alternatives, category) {
  const names = alternatives.slice(0, 4).map(item => item.name);
  const playbook = categoryPlaybook(category);
  return [
    {
      q: `Quelle est la meilleure alternative a ${tool.name} ?`,
      a: `${joinList(names, 'Les solutions les plus proches')} sont les premieres options a comparer. Le bon choix depend surtout de ${joinList(playbook.decision.slice(0, 4))}.`,
    },
    {
      q: `Pourquoi chercher une alternative a ${tool.name} ?`,
      a: `Il faut envisager une alternative si ${tool.name} bloque sur le budget, les integrations, la confidentialite, le support ou un cas d'usage devenu plus exigeant.`,
    },
    {
      q: `Quand faut-il rester sur ${tool.name} ?`,
      a: `Restez sur ${tool.name} si l'equipe le maitrise deja, si les limites actuelles ne vous genent pas et si le cout total reste coherent avec votre usage reel.`,
    },
    {
      q: `Comment comparer objectivement les alternatives ?`,
      a: `Notez vos besoins, testez deux ou trois outils, verifiez les prix apres promotion, controlez les limites du plan gratuit et lisez les conditions de donnees.`,
    },
    {
      q: `${tool.name} convient-il encore aux entreprises ?`,
      a: `Oui si la gouvernance, le support, la securite et les droits utilisateurs correspondent au niveau attendu. Sinon, une alternative plus specialisee peut etre preferable.`,
    },
    {
      q: `Existe-t-il une alternative gratuite a ${tool.name} ?`,
      a: `Certaines alternatives proposent un plan gratuit ou un essai. Il faut toutefois verifier les quotas, exports, integrations et droits commerciaux avant de baser un workflow dessus.`,
    },
    {
      q: `Quelle alternative choisir pour ${playbook.audiences[0]} ?`,
      a: `Pour ${playbook.audiences[0]}, privilegiez l'outil qui resout le mieux le besoin principal : ${playbook.pain}, avec un support et un prix adaptes.`,
    },
    {
      q: `Faut-il migrer toutes ses donnees depuis ${tool.name} ?`,
      a: `Non. Commencez par un pilote limite, exportez les donnees critiques, documentez les integrations et gardez ${tool.name} en secours pendant la transition.`,
    },
  ];
}

export function buildComparisonSeoModel(toolA, toolB, category) {
  const seed = `cmp:${toolA.id}:${toolB.id}`;
  const playbook = categoryPlaybook(category);
  const title = clampMeta(variant([
    `${toolA.name} vs ${toolB.name} : verdict, prix et cas d'usage`,
    `${toolA.name} ou ${toolB.name} ? Le comparatif terrain`,
    `Comparer ${toolA.name} et ${toolB.name} sans se limiter au prix`,
    `${toolA.name} face a ${toolB.name} : forces, limites et choix`,
  ], seed), 64);
  const description = clampMeta(variant([
    `Comparatif detaille ${toolA.name} vs ${toolB.name} : prix, performances, API, securite, support, profils utilisateurs et verdict clair.`,
    `Decidez entre ${toolA.name} et ${toolB.name} avec un tableau, des criteres concrets, des cas d'usage et une FAQ unique.`,
    `Analyse comparative de ${toolA.name} et ${toolB.name} pour ${joinList(playbook.audiences.slice(0, 3))}, avec limites et maillage interne.`,
  ], seed, 1), 158);
  return { seed, title, description, playbook };
}

export function buildComparisonFaq(toolA, toolB, category) {
  const playbook = categoryPlaybook(category);
  return [
    {
      q: `${toolA.name} ou ${toolB.name} : lequel choisir en priorite ?`,
      a: `Choisissez ${toolA.name} si ses points forts collent mieux a votre contrainte principale. Choisissez ${toolB.name} si son prix, son approche ou ses limites sont plus adaptes a votre contexte.`,
    },
    {
      q: `${toolA.name} est-il plus simple que ${toolB.name} ?`,
      a: `La simplicite depend de votre equipe, des integrations deja en place et du niveau de configuration attendu. Testez les deux sur un cas reel avant de generaliser.`,
    },
    {
      q: `Quel outil est le plus interessant pour ${playbook.audiences[0]} ?`,
      a: `Pour ${playbook.audiences[0]}, regardez en premier ${joinList(playbook.decision.slice(0, 3))}. Le meilleur outil est celui qui reduit le plus de friction sur ces points.`,
    },
    {
      q: `${toolA.name} et ${toolB.name} ont-ils une API ?`,
      a: `Verifiez la documentation officielle, les quotas et les exemples SDK. Une API existe parfois, mais son cout et ses limites peuvent changer le verdict.`,
    },
    {
      q: `Quel outil choisir pour une PME ?`,
      a: `Une PME doit comparer le support, la gestion des utilisateurs, la facturation, la securite et la facilite de deploiement avant de trancher.`,
    },
    {
      q: `Quel outil choisir pour un freelance ?`,
      a: `Un freelance doit privilegier le temps gagne, le prix mensuel reel, les exports et la rapidite de prise en main plutot qu'une couverture fonctionnelle trop large.`,
    },
    {
      q: `Le prix suffit-il pour departager ${toolA.name} et ${toolB.name} ?`,
      a: `Non. Le prix doit etre compare avec les limites, les renouvellements, le support, les integrations et le temps necessaire pour obtenir un resultat exploitable.`,
    },
    {
      q: `Comment eviter une mauvaise migration ?`,
      a: `Lancez un test limite, listez les donnees a conserver, prevoyez un retour arriere et validez les integrations critiques avant d'arreter l'ancien outil.`,
    },
  ];
}

export function buildProductSchema(tool) {
  const rating = tool.rating?.value;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tool.name,
    description: text(tool.short || tool.highlight || tool.description),
    ...(tool.logo ? { image: `${BASE_URL}${tool.logo}` } : {}),
    brand: { '@type': 'Brand', name: tool.name },
    ...(rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: Math.max(12, Math.round(rating * 37)),
      },
    } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: typeof tool.priceMonthly === 'number' ? tool.priceMonthly : 0,
      availability: 'https://schema.org/InStock',
      url: tool.website || `${BASE_URL}/tool/${tool.id}`,
    },
  };
}

export function buildImageSchema({ url, name, caption }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url,
    name,
    caption,
  };
}

export function buildHowToSchema({ name, description, steps }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function buildItemListFromLinks(name, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name || item.label,
      url: item.url?.startsWith('http') ? item.url : `${BASE_URL}${item.url || item.href}`,
    })),
  };
}

export function buildSitewideSchemas() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      sameAs: ['https://comparateur-tech.com'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: BASE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/outils?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}
