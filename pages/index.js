import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import ToolCard from '../components/ToolCard';
import SEO from '../components/SEO';
import SeoInternalLinks from '../components/SeoInternalLinks';
import { ArrowRight, Trophy } from 'lucide-react';
import { matchesMainCategory, sortByRating, toCardTool } from '../lib/tool-data';
import { HOME_SEO_LINK_GROUPS } from '../lib/seo-internal-link-groups';
import { useT } from '../lib/i18n';

const CATEGORIES = ['Intelligence artificielle', 'Tout', 'VPN', 'Hébergement web', 'Antivirus'];

// Dictionnaire FR/EN de la page d'accueil (le corps ; le chrome vient de useUI).
const DICT = {
  fr: {
    seoTitle: 'Comparateur-Tech : meilleurs outils IA, VPN et hébergement',
    seoDesc: 'Comparez les meilleurs outils IA, VPN, hébergements web, antivirus et solutions cybersécurité : prix, limites, alternatives et verdicts éditoriaux.',
    start: 'Commencer',
    seeGuide: 'Voir le guide',
    catLabels: { 'Intelligence artificielle': 'Intelligence artificielle', 'Tout': 'Tout', 'VPN': 'VPN', 'Hébergement web': 'Hébergement web', 'Antivirus': 'Antivirus' },
    intentCards: [
      { icon: '🤖', title: 'Je cherche un outil IA', desc: 'Assistants, rédaction, code, image et productivité.', href: '/outils/intelligence-artificielle' },
      { icon: '⚖️', title: 'Je veux comparer 2 outils', desc: 'Pages directes comme ChatGPT vs Claude ou NordVPN vs Surfshark.', href: '/comparatifs' },
      { icon: '🛡️', title: 'Je veux un VPN ou antivirus', desc: 'Sécurité, streaming, confidentialité et protection Windows.', href: '/top-10-vpn' },
      { icon: '🌐', title: 'Je veux héberger un site', desc: 'WordPress, petit budget, support et performances.', href: '/guides/meilleur-hebergement-wordpress' },
    ],
    methodCards: [
      { title: 'Méthode claire', desc: 'Chaque fiche présente le prix, les points forts, les limites, le profil idéal et les alternatives à comparer.' },
      { title: 'Données cohérentes', desc: 'Les compteurs et sélections viennent directement du catalogue, pour éviter les chiffres figés ou incohérents.' },
      { title: 'Liens transparents', desc: 'Certains liens peuvent être affiliés, sans coût supplémentaire pour vous. Le verdict éditorial reste indépendant.' },
    ],
    guidesBadge: '🎯 Guides qui aident à choisir',
    guidesTitle: 'Pages utiles pour décider plus vite',
    guidesDesc: 'Des comparatifs directs et des pages alternatives pour répondre aux recherches les plus proches d’une décision.',
    guidesCta: 'Comparer les outils IA',
    highIntentLinks: [
      { title: 'ChatGPT vs Claude', desc: 'Comparer les deux assistants IA les plus recherchés.', href: '/comparatifs/chatgpt-vs-claude' },
      { title: 'Alternatives à ChatGPT', desc: 'Trouver une IA différente selon le prix et l’usage.', href: '/alternatives/alternative-chatgpt' },
      { title: 'NordVPN vs Surfshark', desc: 'Comparer vitesse, prix, sécurité et multi-appareils.', href: '/comparatifs/nordvpn-vs-surfshark' },
      { title: 'Hostinger vs o2switch', desc: 'Choisir entre prix bas et hébergement français simple.', href: '/comparatifs/hostinger-vs-o2switch' },
    ],
    seoLinksTitle: 'Pages populaires à explorer',
    compareBadge: '⚖️ Comparatif',
    compareTitle: 'Comparez les meilleurs outils',
    compareDesc: 'Filtrez par catégorie, comparez les notes éditoriales, les prix et les essais gratuits avant de lire la fiche complète.',
    seeAllComparisons: 'Voir tous les comparatifs',
    seeTop10: 'Voir le Top 10',
  },
  en: {
    seoTitle: 'Comparateur-Tech: best AI, VPN and hosting tools',
    seoDesc: 'Compare the best AI tools, VPNs, web hosting, antivirus and cybersecurity solutions: pricing, limitations, alternatives and editorial verdicts.',
    start: 'Get started',
    seeGuide: 'View the guide',
    catLabels: { 'Intelligence artificielle': 'Artificial intelligence', 'Tout': 'All', 'VPN': 'VPN', 'Hébergement web': 'Web hosting', 'Antivirus': 'Antivirus' },
    intentCards: [
      { icon: '🤖', title: 'I need an AI tool', desc: 'Assistants, writing, code, image and productivity.', href: '/outils/intelligence-artificielle' },
      { icon: '⚖️', title: 'I want to compare 2 tools', desc: 'Direct pages like ChatGPT vs Claude or NordVPN vs Surfshark.', href: '/comparatifs' },
      { icon: '🛡️', title: 'I want a VPN or antivirus', desc: 'Security, streaming, privacy and Windows protection.', href: '/top-10-vpn' },
      { icon: '🌐', title: 'I want to host a website', desc: 'WordPress, low budget, support and performance.', href: '/guides/meilleur-hebergement-wordpress' },
    ],
    methodCards: [
      { title: 'Clear method', desc: 'Every review lists pricing, strengths, limitations, the ideal profile and the alternatives to compare.' },
      { title: 'Consistent data', desc: 'Counters and selections come straight from the catalog, to avoid frozen or inconsistent figures.' },
      { title: 'Transparent links', desc: 'Some links may be affiliated, at no extra cost to you. The editorial verdict stays independent.' },
    ],
    guidesBadge: '🎯 Guides that help you choose',
    guidesTitle: 'Useful pages to decide faster',
    guidesDesc: 'Direct comparisons and alternative pages answering the searches closest to a decision.',
    guidesCta: 'Compare AI tools',
    highIntentLinks: [
      { title: 'ChatGPT vs Claude', desc: 'Compare the two most searched AI assistants.', href: '/comparatifs/chatgpt-vs-claude' },
      { title: 'ChatGPT alternatives', desc: 'Find a different AI based on price and use case.', href: '/alternatives/alternative-chatgpt' },
      { title: 'NordVPN vs Surfshark', desc: 'Compare speed, price, security and multi-device support.', href: '/comparatifs/nordvpn-vs-surfshark' },
      { title: 'Hostinger vs o2switch', desc: 'Choose between low price and simple French hosting.', href: '/comparatifs/hostinger-vs-o2switch' },
    ],
    seoLinksTitle: 'Popular pages to explore',
    compareBadge: '⚖️ Comparison',
    compareTitle: 'Compare the best tools',
    compareDesc: 'Filter by category, compare editorial ratings, pricing and free trials before reading the full review.',
    seeAllComparisons: 'View all comparisons',
    seeTop10: 'View the Top 10',
  },
};

const CATEGORY_ALIASES = {
  IA: 'Intelligence artificielle',
  'IA générative': 'Intelligence artificielle',

  'Hébergement Web': 'Hébergement web',

  VPN: 'VPN',
  Antivirus: 'Antivirus',

  Cybersécurité: 'Cybersécurité',
  'Scanner réseau': 'Cybersécurité',
  Pentest: 'Cybersécurité',
  'Gestionnaire de mots de passe': 'Cybersécurité',
  MFA: 'Cybersécurité'
};

const CAT_META_FILTER = {
  'Tout': { icon: '⭐' },
  'VPN': { icon: '🛡️' },
  'Hébergement web': { icon: '🌐' },
  'Antivirus': { icon: '🦠' },
  'Intelligence artificielle': { icon: '🤖' },
};

const STRUCTURED_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Comparateur-Tech',
    url: 'https://comparateur-tech.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: 'https://comparateur-tech.com/outils?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Comparateur-Tech',
    url: 'https://comparateur-tech.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://comparateur-tech.com/logo.png',
      width: 200,
      height: 60,
    },
    sameAs: [],
    description: 'Média de comparaison pour les outils IA, VPN, hébergement web et cybersécurité. Fiches éditoriales, benchmarks et sélections indépendantes.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://comparateur-tech.com/contact',
    },
  },
];

function isAITool(tool) {
  return matchesMainCategory(tool, 'Intelligence artificielle');
}

function isAIDevTool(tool) {
  const haystack = [
    tool.name,
    tool.short,
    tool.highlight,
    ...(tool.tags || []),
    ...(tool.idealFor || []),
  ].join(' ').toLowerCase();

  return isAITool(tool) && ['api', 'code', 'développeur', 'developpeur', 'coding', 'ide', 'copilot'].some(term => haystack.includes(term));
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const totalTools = tools.length;
  const verifiedTools = tools.filter(tool => tool.verified).length;
  const aiTools = tools.filter(isAITool).length;
  const aiDevTools = tools.filter(isAIDevTool).length;
  const publicCategories = ['Intelligence artificielle', 'VPN', 'Hébergement web', 'Antivirus', 'Cybersécurité'];
  const totalCategories = [...new Set(
    tools.flatMap(tool => (tool.categories || []).filter(category => publicCategories.includes(category)))
  )].length;

  const spotlightIds = ['openai-api', 'anthropic-api', 'cursor', 'chatgpt'];
  const spotlightTools = spotlightIds
    .map(id => tools.find(tool => tool.id === id))
    .filter(Boolean)
    .map(tool => ({
      id: tool.id,
      name: tool.name,
      short: tool.short,
      href: `/tool/${tool.id}`,
    }));
  const toolsByCategory = Object.fromEntries(
    CATEGORIES.map(category => [
      category,
      sortByRating(tools.filter(tool => matchesMainCategory(tool, category))).slice(0, 8).map(toCardTool),
    ])
  );

  return {
    props: {
      toolsByCategory,
      spotlightTools,
      stats: {
        totalTools,
        verifiedTools,
        aiTools,
        aiDevTools,
        totalCategories,
      },
    },
  };
}

export default function Home({ toolsByCategory, stats }) {
  const t = useT(DICT);
  const [selectedCat, setSelectedCat] = useState('Intelligence artificielle');

  const catTools = useMemo(
    () => toolsByCategory[selectedCat] || [],
    [toolsByCategory, selectedCat]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        canonical="https://comparateur-tech.com/"
        structuredData={STRUCTURED_DATA}
      />
      <Header />
      <main>
        <HeroSection stats={stats} />


        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.intentCards.map((card) => (
                <Link key={card.href} href={card.href} className="group bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <div className="text-2xl mb-3">{card.icon}</div>
                  <p className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">{card.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-purple-700">
                    {t.start} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-4">
              {t.methodCards.map((card) => (
                <div key={card.title} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <p className="font-bold text-gray-900 mb-2">{card.title}</p>
                  <p className="text-sm text-gray-600">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
              <div>
                <span className="inline-block bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
                  {t.guidesBadge}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t.guidesTitle}</h2>
                <p className="text-gray-500 max-w-2xl text-sm sm:text-base">
                  {t.guidesDesc}
                </p>
              </div>
              <Link href="/comparatifs/meilleurs-outils-ia" className="inline-flex items-center justify-center gap-2 gradient-purple text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-purple-300/40 hover:shadow-purple-400/50 transition-all min-h-[48px]">
                {t.guidesCta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {t.highIntentLinks.map((item) => (
                <Link key={item.href} href={item.href} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <p className="text-sm font-bold text-gray-900 mb-2">{item.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-purple-700">
                    {t.seeGuide} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <SeoInternalLinks title={t.seoLinksTitle} groups={HOME_SEO_LINK_GROUPS} />
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-white" id="comparatif">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-7 sm:mb-10">
              <span className="inline-block bg-purple-50 border border-purple-200 text-purple-700 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">{t.compareBadge}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">{t.compareTitle}</h2>
              <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base px-4">{t.compareDesc}</p>
            </div>

            <div className="scroll-x-mobile gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 mb-7 sm:mb-10 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm whitespace-nowrap min-h-[44px] ${
                    selectedCat === cat
                      ? 'gradient-purple text-white shadow-lg shadow-purple-300/50 scale-105'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <span>{CAT_META_FILTER[cat]?.icon}</span> {t.catLabels[cat] || cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-7 sm:mb-10">
              {catTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-0">
              <Link href="/comparatifs" className="bg-white border border-gray-200 text-gray-700 px-6 sm:px-8 py-3 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all inline-flex items-center justify-center gap-2 shadow-sm min-h-[48px]">
                {t.seeAllComparisons} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/top-10-intelligence-artificielle" className="gradient-purple text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-md shadow-purple-300/40 hover:shadow-purple-400/50 transition-all inline-flex items-center justify-center gap-2 min-h-[48px]">
                <Trophy className="w-4 h-4" /> {t.seeTop10}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
