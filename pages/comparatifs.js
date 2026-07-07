import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO, { buildBreadcrumbSchema, buildItemListSchema } from '../components/SEO';
import { Star, ExternalLink, ArrowRight, Search, X } from 'lucide-react';
import { useT, useLocale, pickToolText } from '../lib/i18n';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return { props: { tools } };
}

const CATEGORIES = ['Tout', 'VPN', 'Hébergement web', 'Antivirus', 'Intelligence artificielle'];

const CONTENT = {
  fr: {
    seoTitle: (year) => `Comparatifs outils ${year} : IA, VPN, hébergement`,
    seoDescription: (n) => `Comparez ${n} outils IA, VPN, hébergement web et sécurité : notes, prix, essais gratuits, points forts et avis éditoriaux.`,
    breadcrumbHome: 'Accueil', breadcrumbPage: 'Comparatifs',
    itemListName: 'Comparatifs outils tech',
    itemListDesc: 'Comparatif des outils tech sélectionnés par Comparateur-Tech avec notes, prix, essais et avis.',
    badge: '⚖️ Comparatifs',
    h1: 'Comparez les meilleurs outils',
    intro: 'Notes, prix, essais gratuits, tout pour choisir sans se tromper.',
    searchPlaceholder: 'Rechercher un outil...',
    searchAria: 'Rechercher un outil',
    resultsFound: (n) => `${n > 1 ? 'outils trouvés' : 'outil trouvé'}`,
    inCategory: 'dans',
    noResult: 'Aucun outil dans cette catégorie.',
    verified: '✓ Vérifié', trial: '🆓 Essai', reviews: 'avis',
    viewProfile: 'Voir la fiche', officialSite: 'Site officiel', top: '🏆 Top',
    catLabels: { 'Tout': 'Tout', 'VPN': 'VPN', 'Hébergement web': 'Hébergement web', 'Antivirus': 'Antivirus', 'Intelligence artificielle': 'Intelligence artificielle' },
  },
  en: {
    seoTitle: (year) => `Tool comparisons ${year}: AI, VPN, hosting`,
    seoDescription: (n) => `Compare ${n} AI, VPN, web hosting and security tools: ratings, pricing, free trials, strengths and editorial reviews.`,
    breadcrumbHome: 'Home', breadcrumbPage: 'Comparisons',
    itemListName: 'Tech tool comparisons',
    itemListDesc: 'Comparison of the tech tools selected by Comparateur-Tech with ratings, pricing, trials and reviews.',
    badge: '⚖️ Comparisons',
    h1: 'Compare the best tools',
    intro: 'Ratings, pricing, free trials, everything to choose with confidence.',
    searchPlaceholder: 'Search for a tool...',
    searchAria: 'Search for a tool',
    resultsFound: (n) => `${n > 1 ? 'tools found' : 'tool found'}`,
    inCategory: 'in',
    noResult: 'No tools in this category.',
    verified: '✓ Verified', trial: '🆓 Trial', reviews: 'reviews',
    viewProfile: 'View details', officialSite: 'Official site', top: '🏆 Top',
    catLabels: { 'Tout': 'All', 'VPN': 'VPN', 'Hébergement web': 'Web hosting', 'Antivirus': 'Antivirus', 'Intelligence artificielle': 'Artificial intelligence' },
  },
};

const CAT_META = {
  'Tout':                      { icon: '⭐', topBar: 'bg-purple-500',  border: 'border-purple-200',  badge: 'bg-purple-50 border-purple-200 text-purple-700'   },
  'VPN':                       { icon: '🛡️', topBar: 'bg-blue-500',    border: 'border-blue-200',    badge: 'bg-blue-50 border-blue-200 text-blue-700'         },
  'Hébergement web':           { icon: '🌐', topBar: 'bg-emerald-500', border: 'border-emerald-200', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  'Antivirus':                 { icon: '🦠', topBar: 'bg-red-500',     border: 'border-red-200',     badge: 'bg-red-50 border-red-200 text-red-700'            },
  'Intelligence artificielle': { icon: '🤖', topBar: 'bg-violet-500',  border: 'border-violet-200',  badge: 'bg-violet-50 border-violet-200 text-violet-700'   },
};

function Stars({ val }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(val || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

function ToolCard({ tool, rank }) {
  const t = useT(CONTENT);
  const locale = useLocale();
  const cat = tool.categories?.[0];
  const meta = CAT_META[cat] || CAT_META['Tout'];
  const affUrl = tool.affiliateUrl || tool.website || '#';
  const short = pickToolText(tool, locale, 'short') || pickToolText(tool, locale, 'highlight');

  return (
    <div className={`bg-white rounded-2xl flex flex-col overflow-hidden border-2 ${meta.border} hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group shadow-sm`}>
      {/* Barre colorée top */}
      <div className={`h-1.5 w-full ${meta.topBar}`} />

      <div className="p-5 flex flex-col flex-1 relative">
        {/* Rang + badge Top */}
        <div className="flex items-center justify-between mb-4">
          <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
            {rank + 1}
          </span>
          {rank === 0 && (
            <span className="text-xs bg-yellow-50 border border-yellow-300 text-yellow-700 px-2.5 py-1 rounded-full font-bold">{t.top}</span>
          )}
        </div>

        {/* Logo */}
        <Link href={`/tool/${tool.id}`} className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
            {tool.logo ? (
              <img src={tool.logo} alt={tool.name} width={64} height={64} loading="lazy" decoding="async" className="w-full h-full object-contain p-2"
                onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-3xl">${meta.icon}</span>`; }} />
            ) : (
              <span className="text-3xl">{meta.icon}</span>
            )}
          </div>
        </Link>

        {/* Nom */}
        <div className="text-center mb-3">
          <Link href={`/tool/${tool.id}`}>
            <h3 className="font-bold text-base text-gray-900 group-hover:text-purple-700 transition-colors mb-1">{tool.name}</h3>
          </Link>
          <div className="flex justify-center gap-1.5 flex-wrap">
            {tool.verified && <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full font-semibold">{t.verified}</span>}
            {tool.trial && <span className="text-xs bg-cyan-50 border border-cyan-200 text-cyan-700 px-2 py-0.5 rounded-full font-semibold">{t.trial}</span>}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-xs leading-relaxed text-center mb-4 line-clamp-2 flex-1">{short}</p>

        {/* Note */}
        {tool.rating && (
          <div className="flex flex-col items-center gap-1 mb-3">
            <Stars val={tool.rating.value} />
            <span className="text-xs text-gray-500">{tool.rating.value}/5 · {tool.rating.count} {t.reviews}</span>
          </div>
        )}

        {/* Prix */}
        {tool.price && (
          <div className="text-center mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${meta.badge}`}>{tool.price}</span>
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-2 mt-auto">
          <Link href={`/tool/${tool.id}`}
            className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all">
            {t.viewProfile} <ArrowRight className="w-3 h-3" />
          </Link>
          <a href={affUrl} target="_blank" rel="sponsored nofollow noopener noreferrer"
            className="flex-1 gradient-purple text-white py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-purple-300/40 transition-all">
            {t.officialSite} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ComparatifsPage({ tools }) {
  const t = useT(CONTENT);
  const [selectedCat, setSelectedCat] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = (selectedCat === 'Tout'
    ? tools
    : tools.filter(tool => tool.categories?.includes(selectedCat))
  ).filter(tool => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return tool.name?.toLowerCase().includes(q) || tool.short?.toLowerCase().includes(q) || tool.highlight?.toLowerCase().includes(q);
  }).sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0));

  const structuredData = [
    buildBreadcrumbSchema([
      { name: t.breadcrumbHome, url: '/' },
      { name: t.breadcrumbPage },
    ]),
    buildItemListSchema({
      name: t.itemListName,
      description: t.itemListDesc,
      items: filtered,
    }),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.seoTitle(new Date().getFullYear())}
        description={t.seoDescription(tools.length)}
        canonical="https://comparateur-tech.com/comparatifs"
        structuredData={structuredData}
      />
      <Header />
      <main>

        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-purple-50 to-white border-b border-purple-100">
          <div className="container mx-auto px-6 text-center">
            <span className="inline-block bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              {t.badge}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              {t.h1}
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              {t.intro}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16">

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                  selectedCat === cat
                    ? 'gradient-purple text-white shadow-lg shadow-purple-300/50 scale-105'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50'
                }`}>
                <span className="text-base">{CAT_META[cat].icon}</span>
                {t.catLabels[cat] || cat}
              </button>
            ))}
          </div>

          {/* Barre de recherche */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label={t.searchAria}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Compteur */}
          <p className="text-center text-gray-500 text-sm mb-8">
            <span className="text-purple-700 font-bold">{filtered.length}</span>{' '}{t.resultsFound(filtered.length)}
            {selectedCat !== 'Tout' && <> {t.inCategory} <span className="text-purple-700 font-bold">{t.catLabels[selectedCat]}</span></>}
          </p>

          {/* Grille */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} rank={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t.noResult}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
