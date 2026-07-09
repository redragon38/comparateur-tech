import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ToolCard from '../../components/ToolCard';
import SeoInternalLinks from '../../components/SeoInternalLinks';
import SEO, { buildBreadcrumbSchema, buildItemListSchema } from '../../components/SEO';
import { ChevronRight, Search } from 'lucide-react';
import { TOOL_LIST_PAGE_SIZE, normalizeText, toCardTool } from '../../lib/tool-data';
import { TOOLS_SEO_LINK_GROUPS } from '../../lib/seo-internal-link-groups';
import { useT } from '../../lib/i18n';

const DICT = {
  fr: {
    seoTitle: 'Outils tech comparés : IA, VPN, hébergement, sécurité',
    seoDesc: (n) => `Explorez ${n}+ outils IA, VPN, hébergement, antivirus et cybersécurité avec fiches, notes éditoriales, prix, essais et alternatives.`,
    home: 'Accueil', allTools: 'Tous les outils',
    badge: '🛠️ Tous les outils', h1: 'Découvrez les meilleurs outils',
    subtitle: 'Sélectionnés et testés pour les créateurs, freelances et entrepreneurs.',
    browseByCategory: 'Parcourir par catégorie',
    toolCount: (n) => `${n} outil${n > 1 ? 's' : ''}`,
    searchPlaceholder: 'Rechercher un outil...', all: 'Tous', noneFound: 'Aucun outil trouvé.',
    catLabels: { 'Intelligence artificielle': 'Intelligence artificielle', 'Hébergement web': 'Hébergement web', 'VPN': 'VPN', 'Antivirus': 'Antivirus', 'Cybersécurité': 'Cybersécurité' },
    catShort: { 'Intelligence artificielle': 'IA', 'Hébergement web': 'Hébergement', 'VPN': 'VPN', 'Antivirus': 'Antivirus', 'Cybersécurité': 'Cybersécurité' },
  },
  en: {
    seoTitle: 'Tech tools compared: AI, VPN, hosting, security',
    seoDesc: (n) => `Explore ${n}+ AI, VPN, hosting, antivirus and cybersecurity tools with reviews, editorial ratings, pricing, trials and alternatives.`,
    home: 'Home', allTools: 'All tools',
    badge: '🛠️ All tools', h1: 'Discover the best tools',
    subtitle: 'Selected and tested for creators, freelancers and entrepreneurs.',
    browseByCategory: 'Browse by category',
    toolCount: (n) => `${n} tool${n > 1 ? 's' : ''}`,
    searchPlaceholder: 'Search for a tool...', all: 'All', noneFound: 'No tool found.',
    catLabels: { 'Intelligence artificielle': 'Artificial intelligence', 'Hébergement web': 'Web hosting', 'VPN': 'VPN', 'Antivirus': 'Antivirus', 'Cybersécurité': 'Cybersecurity' },
    catShort: { 'Intelligence artificielle': 'AI', 'Hébergement web': 'Hosting', 'VPN': 'VPN', 'Antivirus': 'Antivirus', 'Cybersécurité': 'Cybersecurity' },
  },
};

function normalizeSlug(text) {
  return text.toLowerCase()
    .replace(/é/g,'e').replace(/è/g,'e').replace(/ê/g,'e')
    .replace(/à/g,'a').replace(/ù/g,'u').replace(/ô/g,'o')
    .replace(/ç/g,'c').replace(/ /g,'-');
}

const CATEGORY_META = {
  'Intelligence artificielle': { icon: '🤖', topBar: 'bg-violet-500', border: 'border-violet-200', badge: 'bg-violet-50 border-violet-200 text-violet-700', desc: 'Boostez votre productivité' },
  'Hébergement web':           { icon: '🌐', topBar: 'bg-emerald-500', border: 'border-emerald-200', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', desc: 'Hébergez vos projets' },
  'VPN':                       { icon: '🛡️', topBar: 'bg-blue-500', border: 'border-blue-200', badge: 'bg-blue-50 border-blue-200 text-blue-700', desc: 'Sécurisez vos connexions' },
  'Antivirus':                 { icon: '🦠', topBar: 'bg-red-500', border: 'border-red-200', badge: 'bg-red-50 border-red-200 text-red-700', desc: 'Protégez vos appareils' },
  'Cybersécurité':             { icon: '🔐', topBar: 'bg-slate-700', border: 'border-slate-200', badge: 'bg-slate-50 border-slate-200 text-slate-700', desc: 'Renforcez votre sécurité' },
};

const FIXED_CATEGORIES = [
  'Intelligence artificielle',
  'Hébergement web',
  'VPN',
  'Antivirus',
  'Cybersécurité',
];

const CATEGORY_ALIASES = {
  IA: 'Intelligence artificielle',
  'IA générative': 'Intelligence artificielle',
  'Hébergement Web': 'Hébergement web',
  VPN: 'VPN',
  Antivirus: 'Antivirus',
  Cybersécurité: 'Cybersécurité',
};

export async function getStaticProps() {
  const filePath = path.join(
    process.cwd(),
    'public',
    'data',
    'tools-slim.json'
  );

  const tools = JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );

  const categoryMap = {
    'Intelligence artificielle': 0,
    'Hébergement web': 0,
    VPN: 0,
    Antivirus: 0,
    Cybersécurité: 0,
  };

  tools.forEach(tool => {
    (tool.categories || []).forEach(cat => {
      const normalized = CATEGORY_ALIASES[cat] || cat;
      if (categoryMap[normalized] !== undefined) {
        categoryMap[normalized]++;
      }
    });
  });

  return {
    props: {
      tools: tools.map(toCardTool),
      categoryMap,
    },
  };
}

export default function ToolsPage({ tools, categoryMap }) {
  const t = useT(DICT);
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    if (!router.isReady) return;
    const query = Array.isArray(router.query.q) ? router.query.q[0] : router.query.q;
    setSearchTerm(query || '');
  }, [router.isReady, router.query.q]);

  const filtered = useMemo(() => {
    const q = normalizeText(deferredSearchTerm.trim());
    return tools.filter(tool => {
      const toolCats = tool.categories || [];
      const matchCat =
        activeCategory === 'all' ||
        toolCats.some(
          cat => (CATEGORY_ALIASES[cat] || cat) === activeCategory
        );
      const matchSearch = !q ||
        normalizeText(`${tool.name} ${tool.short || ''} ${tool.highlight || ''}`).includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, deferredSearchTerm, tools]);

  const totalPages = Math.ceil(filtered.length / TOOL_LIST_PAGE_SIZE);

  const visibleTools = useMemo(() => {
    const start = (currentPage - 1) * TOOL_LIST_PAGE_SIZE;
    const end = start + TOOL_LIST_PAGE_SIZE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, deferredSearchTerm]);

  const structuredData = useMemo(() => [
    buildBreadcrumbSchema([
      { name: t.home, url: '/' },
      { name: t.allTools },
    ]),
    buildItemListSchema({
      name: 'Catalogue Comparateur-Tech',
      description: 'Catalogue des outils IA, VPN, hébergement web, antivirus et cybersécurité sélectionnés par Comparateur-Tech.',
      items: tools,
    }),
  ], [tools]);

  return (
    <>
      <SEO
        title={t.seoTitle}
        description={t.seoDesc(tools.length)}
        canonical={`https://comparateur-tech.com/outils?page=${currentPage}`}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">

          {/* Hero */}
          <section className="py-12 sm:py-20 bg-gradient-to-b from-purple-50 to-white border-b border-purple-100">
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <span className="inline-block bg-white border border-purple-200 text-purple-700 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-sm">
                {t.badge}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 text-gray-900 leading-tight">
                {t.h1}
              </h1>
              <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto px-2">
                {t.subtitle}
              </p>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-16 sm:pb-24">

            {/* Catégories cards */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 text-gray-900">{t.browseByCategory}</h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {FIXED_CATEGORIES.map(cat => {
                  const meta = CATEGORY_META[cat];
                  const slug = normalizeSlug(cat);
                  return (
                    <Link key={cat} href={`/outils/${slug}`}
                      className={`bg-white rounded-2xl overflow-hidden border-2 ${meta.border} hover:shadow-lg transition-all duration-300 group select-none min-h-[72px]`}>
                      <div className={`h-1.5 w-full ${meta.topBar}`} />
                      <div className="p-3 sm:p-5 flex items-center gap-3 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${meta.badge} border flex items-center justify-center text-xl sm:text-2xl flex-shrink-0`}>
                          {meta.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">{t.catLabels[cat] || cat}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{t.toolCount(categoryMap[cat])}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 hidden sm:block" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mb-8 sm:mb-12">
              <SeoInternalLinks groups={TOOLS_SEO_LINK_GROUPS} />
            </div>

            {/* Filtres + recherche */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 shadow-sm transition-all text-base"
                />
              </div>
              {/* Filtres, scroll horizontal sur mobile */}
              <div className="scroll-x-mobile gap-2 sm:flex sm:flex-wrap sm:gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all select-none whitespace-nowrap min-h-[40px] ${
                    activeCategory === 'all'
                      ? 'gradient-purple text-white shadow-md shadow-purple-300/40'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700'
                  }`}>
                  {t.all} ({tools.length})
                </button>
                {FIXED_CATEGORIES.map(cat => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all select-none whitespace-nowrap min-h-[40px] ${
                        activeCategory === cat
                          ? 'gradient-purple text-white shadow-md shadow-purple-300/40'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700'
                      }`}>
                      {meta.icon} {t.catShort[cat] || cat.split(' ')[0]} ({categoryMap[cat]})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grille outils, 2 colonnes sur mobile */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {visibleTools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20">
                <p className="text-gray-500 text-base sm:text-lg">{t.noneFound}</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                      currentPage === page
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:text-purple-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
