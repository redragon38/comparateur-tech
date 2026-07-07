import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import ToolCard from '../components/ToolCard';
import SEO from '../components/SEO';
import { ArrowRight, Trophy } from 'lucide-react';
import { useT, useLocale, pickToolText } from '../lib/i18n';

const CATEGORIES = ['Intelligence artificielle', 'Tout', 'VPN', 'Hébergement web', 'Antivirus'];

const CAT_META_FILTER = {
  'Tout': { icon: '⭐' },
  'VPN': { icon: '🛡️' },
  'Hébergement web': { icon: '🌐' },
  'Antivirus': { icon: '🦠' },
  'Intelligence artificielle': { icon: '🤖' },
};

const CONTENT = {
  fr: {
    seoTitle: 'Comparateur-Tech : IA, API IA et outils dev comparés',
    seoDescription: 'Comparez API IA, assistants génératifs, IDE IA et outils pour développeurs : usages, limites, alternatives et verdicts par profil.',
    orgDescription: 'Média de comparaison pour les outils IA, VPN, hébergement web et cybersécurité. Fiches éditoriales, benchmarks et sélections indépendantes.',
    trustCards: [
      { title: 'Méthode transparente', desc: "Chaque fiche suit une structure cohérente : cas d'usage, prix, points forts, limites, verdict et liens internes pour continuer la comparaison." },
      { title: 'Compteurs reliés aux données', desc: 'Les chiffres affichés en homepage sont calculés à partir des vraies fiches du site, avec priorité donnée au cluster IA et outils pour développeurs.' },
      { title: 'Affiliation signalée', desc: "Certains liens peuvent être affiliés, sans influencer l'existence d'une fiche, la structure éditoriale ni notre verdict final." },
    ],
    spotlightBadge: '🎯 Cluster IA prioritaire',
    spotlightTitle: 'Pages à forte intention SEO pour développeurs',
    spotlightIntro: 'Les fiches et guides les plus stratégiques du moment pour capter des recherches autour des API IA, des outils de code et des assistants génératifs.',
    spotlightCta: 'Lire le comparatif OpenAI vs Anthropic',
    viewProfile: 'Voir la fiche',
    compareBadge: '⚖️ Comparatif',
    compareTitle: 'Comparez les meilleurs outils',
    compareIntro: 'La sélection IA inclut aussi les fiches IA générative pour éviter les trous de maillage et les faux filtres en homepage.',
    catLabels: { 'Tout': 'Tout', 'VPN': 'VPN', 'Hébergement web': 'Hébergement web', 'Antivirus': 'Antivirus', 'Intelligence artificielle': 'Intelligence artificielle' },
    allComparisons: 'Voir tous les comparatifs',
    viewTop10: 'Voir le Top 10',
  },
  en: {
    seoTitle: 'Comparateur-Tech: AI, AI APIs and dev tools compared',
    seoDescription: 'Compare AI APIs, generative assistants, AI IDEs and developer tools: use cases, limitations, alternatives and verdicts by profile.',
    orgDescription: 'Comparison media for AI tools, VPNs, web hosting and cybersecurity. Editorial reviews, benchmarks and independent selections.',
    trustCards: [
      { title: 'Transparent method', desc: 'Every listing follows a consistent structure: use cases, pricing, strengths, limitations, verdict and internal links to keep comparing.' },
      { title: 'Data-driven counters', desc: 'The figures shown on the homepage are computed from the site\'s real listings, with priority given to the AI and developer tools cluster.' },
      { title: 'Disclosed affiliation', desc: 'Some links may be affiliated, without influencing whether a listing exists, its editorial structure or our final verdict.' },
    ],
    spotlightBadge: '🎯 Priority AI cluster',
    spotlightTitle: 'High-intent SEO pages for developers',
    spotlightIntro: 'The most strategic listings and guides right now to capture searches around AI APIs, coding tools and generative assistants.',
    spotlightCta: 'Read the OpenAI vs Anthropic comparison',
    viewProfile: 'View details',
    compareBadge: '⚖️ Comparison',
    compareTitle: 'Compare the best tools',
    compareIntro: 'The AI selection also includes generative AI listings to avoid gaps in internal linking and misleading homepage filters.',
    catLabels: { 'Tout': 'All', 'VPN': 'VPN', 'Hébergement web': 'Web hosting', 'Antivirus': 'Antivirus', 'Intelligence artificielle': 'Artificial intelligence' },
    allComparisons: 'See all comparisons',
    viewTop10: 'See the Top 10',
  },
};

function buildStructuredData(t, locale) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Comparateur-Tech',
      url: 'https://comparateur-tech.com',
      inLanguage: locale,
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `https://comparateur-tech.com/${locale}/outils?q={search_term_string}` },
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
      description: t.orgDescription,
      foundingDate: '2024',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: `https://comparateur-tech.com/${locale}/contact`,
      },
    },
  ];
}

function isAITool(tool) {
  const categories = tool.categories || [];
  return categories.includes('Intelligence artificielle') || categories.includes('IA générative');
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
      en: tool.en ? { short: tool.en.short ?? null } : null,
      href: `/tool/${tool.id}`,
    }));

  return {
    props: {
      tools,
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

export default function Home({ tools, stats, spotlightTools }) {
  const t = useT(CONTENT);
  const locale = useLocale();
  const [selectedCat, setSelectedCat] = useState('Intelligence artificielle');

  const catTools = (selectedCat === 'Tout'
    ? tools
    : tools.filter(tool => {
        const categories = tool.categories || [];
        if (selectedCat === 'Intelligence artificielle') {
          return categories.includes('Intelligence artificielle') || categories.includes('IA générative');
        }
        return categories.includes(selectedCat);
      })
  )
    .sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        canonical="https://comparateur-tech.com/"
        structuredData={buildStructuredData(t, locale)}
      />
      <Header />
      <main>
        <HeroSection stats={stats} />

        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-4">
              {t.trustCards.map((card) => (
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
                  {t.spotlightBadge}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t.spotlightTitle}</h2>
                <p className="text-gray-500 max-w-2xl text-sm sm:text-base">
                  {t.spotlightIntro}
                </p>
              </div>
              <Link href="/blog/openai-api-vs-anthropic-api" className="inline-flex items-center justify-center gap-2 gradient-purple text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-purple-300/40 hover:shadow-purple-400/50 transition-all min-h-[48px]">
                {t.spotlightCta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {spotlightTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <p className="text-sm font-bold text-gray-900 mb-2">{tool.name}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{pickToolText(tool, locale, 'short')}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-purple-700">
                    {t.viewProfile} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-white" id="comparatif">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-7 sm:mb-10">
              <span className="inline-block bg-purple-50 border border-purple-200 text-purple-700 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">{t.compareBadge}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">{t.compareTitle}</h2>
              <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base px-4">{t.compareIntro}</p>
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
                {t.allComparisons} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/top-10-intelligence-artificielle" className="gradient-purple text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-md shadow-purple-300/40 hover:shadow-purple-400/50 transition-all inline-flex items-center justify-center gap-2 min-h-[48px]">
                <Trophy className="w-4 h-4" /> {t.viewTop10}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
