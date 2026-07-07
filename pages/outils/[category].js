import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Star, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ToolCard from '../../components/ToolCard';
import SEO, { buildBreadcrumbSchema, buildFAQSchema, buildItemListSchema } from '../../components/SEO';
import { localizePaths, useLocale, useT } from '../../lib/i18n';

// Fonction utilitaire pour normaliser les slugs (enlever accents)
function normalizeSlug(text) {
  return text.toLowerCase()
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')
    .replace(/ê/g, 'e')
    .replace(/à/g, 'a')
    .replace(/ù/g, 'u')
    .replace(/ô/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ /g, '-');
}

// Styles par catégorie (indépendants de la langue)
const CATEGORY_STYLE = {
  'intelligence-artificielle': {
    icon: '🤖', color: 'from-purple-600 to-violet-500', colorSolid: '#a855f7', glow: 'rgba(168,85,247,0.2)',
    border: 'border-purple-500/30', bg: 'bg-purple-900/20', textColor: 'text-gray-900',
  },
  'hebergement-web': {
    icon: '🌐', color: 'from-emerald-600 to-teal-500', colorSolid: '#10b981', glow: 'rgba(16,185,129,0.2)',
    border: 'border-emerald-500/30', bg: 'bg-emerald-900/20', textColor: 'text-gray-900',
  },
  'vpn': {
    icon: '🛡️', color: 'from-blue-600 to-cyan-500', colorSolid: '#3b82f6', glow: 'rgba(59,130,246,0.2)',
    border: 'border-blue-500/30', bg: 'bg-blue-900/20', textColor: 'text-gray-900',
  },
  'ia-generative': {
    icon: '✨', color: 'from-pink-600 to-violet-500', colorSolid: '#ec4899', glow: 'rgba(236,72,153,0.2)',
    border: 'border-pink-500/30', bg: 'bg-pink-900/20', textColor: 'text-gray-900',
  },
  'antivirus': {
    icon: '🦠', color: 'from-red-600 to-orange-500', colorSolid: '#ef4444', glow: 'rgba(239,68,68,0.2)',
    border: 'border-red-500/30', bg: 'bg-red-900/20', textColor: 'text-gray-900',
  },
  'cybersecurite': {
    icon: '🔐', color: 'from-slate-600 to-gray-800', colorSolid: '#334155', glow: 'rgba(51,65,85,0.2)',
    border: 'border-slate-500/30', bg: 'bg-slate-900/20', textColor: 'text-gray-900',
  },
};

const DEFAULT_STYLE = {
  icon: '🛠️', color: 'from-pink-600 to-purple-500', colorSolid: '#ec4899', glow: 'rgba(236,72,153,0.2)',
  border: 'border-pink-500/30', bg: 'bg-pink-900/20', textColor: 'text-gray-900',
};

// Textes par catégorie et par langue
const CATEGORY_TEXT = {
  fr: {
    'intelligence-artificielle': {
      label: 'Intelligence artificielle',
      desc: 'Boostez votre productivité avec des outils IA de pointe : automatisation, génération de contenu, analyse et bien plus encore.',
      longDesc: "L'intelligence artificielle révolutionne la façon dont les créateurs et entrepreneurs travaillent. Des outils de génération de contenu aux plateformes d'automatisation, découvrez comment l'IA peut transformer votre quotidien.",
    },
    'hebergement-web': {
      label: 'Hébergement web',
      desc: 'Hébergez vos sites et applications web avec les meilleures plateformes sélectionnées par Comparateur-Tech.',
      longDesc: "Un hébergement web fiable est la fondation de tout projet en ligne. Qu'il s'agisse d'un blog, d'une boutique e-commerce ou d'une application web, choisir le bon hébergeur est crucial pour la performance, la sécurité et la disponibilité de votre site.",
    },
    'vpn': {
      label: 'VPN',
      desc: 'Protégez votre vie privée, sécurisez vos connexions et naviguez librement avec les meilleurs VPN sélectionnés par Comparateur-Tech.',
      longDesc: 'Un VPN (Virtual Private Network) est indispensable pour tout créateur ou entrepreneur soucieux de sa sécurité numérique. Que vous travailliez depuis un café, en déplacement ou depuis chez vous, un VPN chiffre vos connexions et masque votre adresse IP.',
    },
    'ia-generative': {
      label: 'IA générative',
      desc: "Générez du texte, des images et des vidéos avec les meilleurs outils d'IA générative : ChatGPT, Midjourney, Claude et bien plus.",
      longDesc: "L'IA générative transforme la création de contenu. Que ce soit pour rédiger, illustrer, coder ou générer des vidéos, ces outils permettent de produire en quelques secondes ce qui prenait des heures. Découvrez notre sélection des meilleures solutions d'IA générative pour booster votre créativité et votre productivité.",
    },
    'antivirus': {
      label: 'Antivirus',
      desc: 'Protégez vos appareils contre les virus, malwares, ransomwares et toutes les cybermenaces avec les meilleures solutions antivirus.',
      longDesc: 'Un antivirus performant est la première ligne de défense contre les cybermenaces. Que vous soyez créateur, entrepreneur ou particulier, protéger vos appareils et vos données est une priorité. Découvrez les solutions les plus efficaces pour sécuriser votre environnement numérique.',
    },
    'cybersecurite': {
      label: 'Cybersécurité',
      desc: 'Renforcez votre sécurité numérique avec les meilleurs outils de gestion des accès, de protection des appareils et de défense serveur.',
      longDesc: "La cybersécurité ne se limite pas à l'antivirus. Gestionnaires de mots de passe, authentification forte, protection anti-malware et outils de défense serveur permettent de mieux protéger vos comptes, vos appareils et vos infrastructures au quotidien.",
    },
    default: {
      desc: 'Découvrez les meilleurs outils de cette catégorie, sélectionnés pour les créateurs et entrepreneurs.',
      longDesc: 'Une sélection rigoureuse des meilleurs outils pour vous aider à booster votre activité.',
    },
  },
  en: {
    'intelligence-artificielle': {
      label: 'Artificial intelligence',
      desc: 'Boost your productivity with cutting-edge AI tools: automation, content generation, analysis and much more.',
      longDesc: 'Artificial intelligence is revolutionizing how creators and entrepreneurs work. From content generation tools to automation platforms, discover how AI can transform your daily workflow.',
    },
    'hebergement-web': {
      label: 'Web hosting',
      desc: 'Host your websites and web applications with the best platforms selected by Comparateur-Tech.',
      longDesc: 'Reliable web hosting is the foundation of any online project. Whether you run a blog, an e-commerce store or a web application, choosing the right host is crucial for performance, security and availability.',
    },
    'vpn': {
      label: 'VPN',
      desc: 'Protect your privacy, secure your connections and browse freely with the best VPNs selected by Comparateur-Tech.',
      longDesc: 'A VPN (Virtual Private Network) is essential for any creator or entrepreneur who cares about digital security. Whether you work from a café, on the road or from home, a VPN encrypts your connections and hides your IP address.',
    },
    'ia-generative': {
      label: 'Generative AI',
      desc: 'Generate text, images and videos with the best generative AI tools: ChatGPT, Midjourney, Claude and many more.',
      longDesc: 'Generative AI is transforming content creation. Whether for writing, illustrating, coding or generating videos, these tools produce in seconds what used to take hours. Discover our selection of the best generative AI solutions to boost your creativity and productivity.',
    },
    'antivirus': {
      label: 'Antivirus',
      desc: 'Protect your devices against viruses, malware, ransomware and all cyber threats with the best antivirus solutions.',
      longDesc: 'A capable antivirus is the first line of defense against cyber threats. Whether you are a creator, an entrepreneur or an individual, protecting your devices and data is a priority. Discover the most effective solutions to secure your digital environment.',
    },
    'cybersecurite': {
      label: 'Cybersecurity',
      desc: 'Strengthen your digital security with the best tools for access management, device protection and server defense.',
      longDesc: 'Cybersecurity goes beyond antivirus. Password managers, strong authentication, anti-malware protection and server defense tools help you better protect your accounts, devices and infrastructure every day.',
    },
    default: {
      desc: 'Discover the best tools in this category, selected for creators and entrepreneurs.',
      longDesc: 'A rigorous selection of the best tools to help you grow your business.',
    },
  },
};

// Guides d'achat par catégorie et par langue
const CATEGORY_GUIDES = {
  fr: {
    'vpn': {
      criteria: ['Politique no-log et juridiction', 'Vitesse réelle des serveurs', 'Applications Windows, macOS, iOS et Android', 'Streaming, P2P et connexions simultanées'],
      buyerHint: "Pour un VPN, le meilleur choix dépend moins du nombre de serveurs annoncé que de la régularité des débits, de la politique de confidentialité et de la simplicité des applications.",
    },
    'hebergement-web': {
      criteria: ['Temps de chargement et disponibilité', 'Support client et sauvegardes', 'Gestion WordPress ou VPS', 'Prix de renouvellement après promotion'],
      buyerHint: "Un hébergeur web doit être choisi selon le type de projet : blog, vitrine, boutique, application ou site à fort trafic. Les sauvegardes et le support comptent autant que le prix d'appel.",
    },
    'antivirus': {
      criteria: ['Détection malware et phishing', 'Impact sur les performances', 'Protection ransomware', 'VPN, contrôle parental et mots de passe inclus'],
      buyerHint: "Un bon antivirus doit protéger sans ralentir l'appareil. Les suites les plus complètes ajoutent un VPN, une surveillance web et des outils familiaux, mais ces options varient selon le plan.",
    },
    'cybersecurite': {
      criteria: ["Risque couvert par l'outil", 'Déploiement et prise en main', 'Alertes, rapports et intégrations', "Coût opérationnel pour l'équipe"],
      buyerHint: "En cybersécurité, il faut d'abord identifier le risque prioritaire : mots de passe, authentification, vulnérabilités, supervision, poste de travail ou infrastructure.",
    },
    default: {
      criteria: ['Fonctionnalités utiles', 'Prix réel', 'Support', 'Simplicité de prise en main'],
      buyerHint: "Comparez les outils selon votre cas d'usage, votre budget et le niveau de support dont vous aurez besoin après l'achat.",
    },
  },
  en: {
    'vpn': {
      criteria: ['No-log policy and jurisdiction', 'Real server speeds', 'Windows, macOS, iOS and Android apps', 'Streaming, P2P and simultaneous connections'],
      buyerHint: 'For a VPN, the best choice depends less on the advertised server count than on consistent speeds, the privacy policy and how simple the apps are to use.',
    },
    'hebergement-web': {
      criteria: ['Load times and availability', 'Customer support and backups', 'WordPress or VPS management', 'Renewal price after the promotional period'],
      buyerHint: 'A web host should be chosen based on your project type: blog, showcase site, store, application or high-traffic site. Backups and support matter as much as the introductory price.',
    },
    'antivirus': {
      criteria: ['Malware and phishing detection', 'Performance impact', 'Ransomware protection', 'Bundled VPN, parental controls and password manager'],
      buyerHint: 'A good antivirus must protect without slowing the device down. The most complete suites add a VPN, web monitoring and family tools, but these options vary by plan.',
    },
    'cybersecurite': {
      criteria: ['Risk covered by the tool', 'Deployment and onboarding', 'Alerts, reports and integrations', 'Operational cost for the team'],
      buyerHint: 'In cybersecurity, first identify your priority risk: passwords, authentication, vulnerabilities, monitoring, workstations or infrastructure.',
    },
    default: {
      criteria: ['Useful features', 'Real price', 'Support', 'Ease of use'],
      buyerHint: 'Compare tools based on your use case, budget and the level of support you will need after purchase.',
    },
  },
};

// Chrome de page par langue
const UI_TEXT = {
  fr: {
    home: 'Accueil',
    tools: 'Outils',
    allTools: 'Tous les outils',
    categoriesTitle: 'Catégories',
    otherCategories: 'Autres catégories',
    toolCount: (n) => `${n} outil${n > 1 ? 's' : ''}`,
    toolsAvailable: (n) => `${n} outil${n > 1 ? 's' : ''} disponible${n > 1 ? 's' : ''}`,
    howToChoose: (label) => `Comment choisir un outil ${label.toLowerCase()} ?`,
    faqTitle: (label) => `Questions fréquentes sur ${label.toLowerCase()}`,
    noTools: "Aucun outil dans cette catégorie pour l'instant.",
    seoTitle: (label, year) => `${label} – Comparatif & Avis ${year} | Comparateur-Tech`,
    seoDescription: (label, year, n) => `Comparez les meilleurs ${label.toLowerCase()} : avis experts, prix, essais gratuits et classement ${year}. ${n} outils sélectionnés et vérifiés.`,
    itemListName: (label) => `Comparatif ${label}`,
    faq: {
      q1: (label) => `Comment choisir un outil ${label.toLowerCase()} ?`,
      a1: "Commencez par votre besoin principal, puis comparez le prix réel, les limites, le support et les fonctionnalités indispensables. Les notes seules ne suffisent pas : il faut vérifier l'adéquation avec votre usage.",
      q2: (label) => `Combien d'outils ${label.toLowerCase()} sont comparés ?`,
      a2: (label, n) => `Cette page compare ${n} outil${n > 1 ? 's' : ''} ${label.toLowerCase()} avec leurs prix, points forts, essais disponibles et fiches détaillées.`,
      q3: 'Quels outils regarder en priorité ?',
      a3WithTools: (topTools) => `Les outils les mieux notés de cette sélection incluent notamment ${topTools}. Le meilleur choix dépend ensuite de votre budget et de vos contraintes techniques.`,
      a3NoTools: 'Regardez en priorité les solutions qui documentent clairement leurs prix, leurs limites et leurs cas d\'usage.',
    },
  },
  en: {
    home: 'Home',
    tools: 'Tools',
    allTools: 'All tools',
    categoriesTitle: 'Categories',
    otherCategories: 'Other categories',
    toolCount: (n) => `${n} tool${n > 1 ? 's' : ''}`,
    toolsAvailable: (n) => `${n} tool${n > 1 ? 's' : ''} available`,
    howToChoose: (label) => `How to choose a ${label.toLowerCase()} tool?`,
    faqTitle: (label) => `Frequently asked questions about ${label.toLowerCase()}`,
    noTools: 'No tools in this category yet.',
    seoTitle: (label, year) => `${label} – Comparison & Reviews ${year} | Comparateur-Tech`,
    seoDescription: (label, year, n) => `Compare the best ${label.toLowerCase()} tools: expert reviews, pricing, free trials and ${year} ranking. ${n} tools selected and verified.`,
    itemListName: (label) => `${label} comparison`,
    faq: {
      q1: (label) => `How do I choose a ${label.toLowerCase()} tool?`,
      a1: 'Start from your main need, then compare the real price, the limitations, the support and the must-have features. Ratings alone are not enough: check the fit with your actual use case.',
      q2: (label) => `How many ${label.toLowerCase()} tools are compared?`,
      a2: (label, n) => `This page compares ${n} ${label.toLowerCase()} tool${n > 1 ? 's' : ''} with their pricing, strengths, available trials and detailed reviews.`,
      q3: 'Which tools should I look at first?',
      a3WithTools: (topTools) => `The highest-rated tools in this selection include ${topTools}. The best choice then depends on your budget and technical constraints.`,
      a3NoTools: 'Prioritize solutions that clearly document their pricing, limitations and use cases.',
    },
  },
};

// Les catégories gérées par cette page (IA a sa propre page dédiée)
const FIXED_CATEGORIES = [
  { slug: 'hebergement-web' },
  { slug: 'vpn' },
  { slug: 'antivirus' },
  { slug: 'cybersecurite' },
];

const SIDEBAR_CATEGORIES = ['intelligence-artificielle', 'hebergement-web', 'vpn', 'antivirus', 'cybersecurite'];

function getStyle(slug) {
  return CATEGORY_STYLE[slug] || DEFAULT_STYLE;
}

function getText(locale, slug) {
  const dict = CATEGORY_TEXT[locale] || CATEGORY_TEXT.fr;
  if (dict[slug]) return dict[slug];
  const fallbackLabel = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return { label: fallbackLabel, ...dict.default };
}

function getGuide(locale, slug) {
  const dict = CATEGORY_GUIDES[locale] || CATEGORY_GUIDES.fr;
  return dict[slug] || dict.default;
}

export async function getStaticPaths() {
  const paths = FIXED_CATEGORIES.map(cat => ({
    params: { category: cat.slug },
  }));
  return { paths: localizePaths(paths), fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const slug = params.category;

  // Filtrer les outils de cette catégorie
  const tools = allTools.filter(tool =>
    (tool.categories || []).map(c => normalizeSlug(c)).includes(slug)
  );

  // Sidebar : compteurs par catégorie
  const categoryCounts = {};
  SIDEBAR_CATEGORIES.forEach(catSlug => {
    categoryCounts[catSlug] = allTools.filter(t =>
      (t.categories || []).some(cat => normalizeSlug(cat) === catSlug)
    ).length;
  });

  return {
    props: { tools, slug, categoryCounts },
  };
}

function StarRating({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.floor(value) ? 'text-gray-600 fill-yellow-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
}

function buildCategoryFaq(label, tools, faqText) {
  const topTools = tools.slice(0, 3).map(t => t.name).join(', ');
  return [
    { q: faqText.q1(label), a: faqText.a1 },
    { q: faqText.q2(label), a: faqText.a2(label, tools.length) },
    { q: faqText.q3, a: topTools ? faqText.a3WithTools(topTools) : faqText.a3NoTools },
  ];
}

export default function CategoryPage({ tools, slug, categoryCounts }) {
  const locale = useLocale();
  const t = useT(UI_TEXT);
  const style = getStyle(slug);
  const text = getText(locale, slug);
  const meta = { ...style, ...text };
  const categoryGuide = getGuide(locale, slug);
  const categoryFaq = buildCategoryFaq(meta.label, tools, t.faq);
  const year = new Date().getFullYear();

  const allCategories = SIDEBAR_CATEGORIES.map(catSlug => ({
    slug: catSlug,
    label: getText(locale, catSlug).label,
    count: categoryCounts[catSlug] || 0,
  }));

  const structuredData = [
    buildBreadcrumbSchema([
      { name: t.home, url: '/' },
      { name: t.tools, url: '/outils' },
      { name: meta.label },
    ]),
    buildItemListSchema({
      name: t.itemListName(meta.label),
      description: meta.desc,
      items: tools,
    }),
    buildFAQSchema(categoryFaq),
  ];

  return (
    <>
      <SEO
        title={t.seoTitle(meta.label, year)}
        description={t.seoDescription(meta.label, year, tools.length)}
        structuredData={structuredData}
        canonical={`https://comparateur-tech.com/outils/${slug}`}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 800px 400px at 50% -50px, ${meta.glow}, transparent)` }} />
            <div className="container mx-auto px-6 relative z-10">
              <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                <Link href="/" className="hover:text-gray-900 transition-colors">{t.home}</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/outils" className="hover:text-gray-900 transition-colors">{t.tools}</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900">{meta.label}</span>
              </nav>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-4xl flex-shrink-0 shadow-2xl`}
                  style={{ boxShadow: `0 0 40px ${meta.glow}` }}>
                  {meta.icon}
                </div>
                <div>
                  <div className={`inline-block text-xs font-semibold tracking-widest uppercase ${meta.textColor} ${meta.bg} border ${meta.border} px-3 py-1 rounded-full mb-3`}>
                    {t.toolsAvailable(tools.length)}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">{meta.label}</h1>
                  <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">{meta.desc}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-6 pb-32">
            <div className="flex flex-col lg:flex-row gap-10">
              <aside className="lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 sticky top-24">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{t.categoriesTitle}</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/outils" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-purple-50 transition-all">
                        <span className="flex items-center gap-2"><span>🗂️</span> {t.allTools}</span>
                      </Link>
                    </li>
                    {allCategories.map(cat => {
                      const m = getStyle(cat.slug);
                      const isActive = cat.slug === slug;
                      return (
                        <li key={cat.slug}>
                          <Link href={`/outils/${cat.slug}`}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                              isActive ? `${m.bg} ${m.textColor} border ${m.border} font-semibold` : 'text-gray-900 hover:bg-purple-50'
                            }`}>
                            <span className="flex items-center gap-2"><span>{m.icon}</span><span>{cat.label}</span></span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-md ${isActive ? m.bg : 'bg-gray-100'} ${m.textColor}`}>{cat.count}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>

              <div className="flex-1 min-w-0">
                {meta.longDesc && (
                  <div className={`gradient-card border ${meta.border} rounded-2xl p-6 mb-8`}>
                    <p className="text-gray-600 leading-relaxed">{meta.longDesc}</p>
                  </div>
                )}
                <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">{t.howToChoose(meta.label)}</h2>
                  <p className="text-gray-600 leading-relaxed mb-5">{categoryGuide.buyerHint}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categoryGuide.criteria.map(criterion => (
                      <div key={criterion} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <p className="text-sm font-semibold text-gray-800">{criterion}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {tools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {tools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} onSelect={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-purple-100 shadow-sm">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-gray-900 text-lg">{t.noTools}</p>
                  </div>
                )}
                <section className="mt-12 bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">{t.faqTitle(meta.label)}</h2>
                  <div className="space-y-4">
                    {categoryFaq.map(item => (
                      <div key={item.q} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">{item.q}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {allCategories.filter(c => c.slug !== slug).length > 0 && (
                  <div className="mt-16">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t.otherCategories}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {allCategories.filter(c => c.slug !== slug).map(cat => {
                        const m = getStyle(cat.slug);
                        return (
                          <Link key={cat.slug} href={`/outils/${cat.slug}`}
                            className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 flex items-center gap-4 hover:-translate-y-1 hover:border-purple-500/40 transition-all duration-300 group">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              {m.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{cat.label}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{t.toolCount(cat.count)}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-purple-600 transition-colors" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
