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

const CATEGORIES = ['Intelligence artificielle', 'Tout', 'VPN', 'Hébergement web', 'Antivirus'];

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
        title="Comparateur-Tech : IA, API IA et outils dev comparés"
        description="Comparez API IA, assistants génératifs, IDE IA et outils pour développeurs : usages, limites, alternatives et verdicts par profil."
        canonical="https://comparateur-tech.com/"
        structuredData={STRUCTURED_DATA}
      />
      <Header />
      <main>
        <HeroSection stats={stats} />

        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="font-bold text-gray-900 mb-2">Méthode transparente</p>
                <p className="text-sm text-gray-600">
                  Chaque fiche suit une structure cohérente : cas d’usage, prix, points forts, limites, verdict et liens internes pour continuer la comparaison.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="font-bold text-gray-900 mb-2">Compteurs reliés aux données</p>
                <p className="text-sm text-gray-600">
                  Les chiffres affichés en homepage sont calculés à partir des vraies fiches du site, avec priorité donnée au cluster IA et outils pour développeurs.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="font-bold text-gray-900 mb-2">Affiliation signalée</p>
                <p className="text-sm text-gray-600">
                  Certains liens peuvent être affiliés, sans influencer l’existence d’une fiche, la structure éditoriale ni notre verdict final.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
              <div>
                <span className="inline-block bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
                  🎯 Cluster IA prioritaire
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Pages à forte intention SEO pour développeurs</h2>
                <p className="text-gray-500 max-w-2xl text-sm sm:text-base">
                  Les fiches et guides les plus stratégiques du moment pour capter des recherches autour des API IA, des outils de code et des assistants génératifs.
                </p>
              </div>
              <Link href="/blog/openai-api-vs-anthropic-api" className="inline-flex items-center justify-center gap-2 gradient-purple text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-purple-300/40 hover:shadow-purple-400/50 transition-all min-h-[48px]">
                Lire le comparatif OpenAI vs Anthropic <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {spotlightTools.map((tool) => (
                <Link key={tool.id} href={tool.href} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <p className="text-sm font-bold text-gray-900 mb-2">{tool.name}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{tool.short}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-purple-700">
                    Voir la fiche <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 bg-white" id="comparatif">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-7 sm:mb-10">
              <span className="inline-block bg-purple-50 border border-purple-200 text-purple-700 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">⚖️ Comparatif</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">Comparez les meilleurs outils</h2>
              <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base px-4">La sélection IA inclut aussi les fiches IA générative pour éviter les trous de maillage et les faux filtres en homepage.</p>
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
                  <span>{CAT_META_FILTER[cat]?.icon}</span> {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-7 sm:mb-10">
              {catTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-0">
              <Link href="/comparatifs" className="bg-white border border-gray-200 text-gray-700 px-6 sm:px-8 py-3 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all inline-flex items-center justify-center gap-2 shadow-sm min-h-[48px]">
                Voir tous les comparatifs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/top-10-intelligence-artificielle" className="gradient-purple text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-md shadow-purple-300/40 hover:shadow-purple-400/50 transition-all inline-flex items-center justify-center gap-2 min-h-[48px]">
                <Trophy className="w-4 h-4" /> Voir le Top 10
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
