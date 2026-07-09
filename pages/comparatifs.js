import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SeoInternalLinks from '../components/SeoInternalLinks';
import SEO, { buildBreadcrumbSchema, buildItemListSchema } from '../components/SEO';
import { Star, ExternalLink, ArrowRight, Search, X, Scale } from 'lucide-react';
import { TOOL_LIST_PAGE_SIZE, matchesMainCategory, normalizeText, sortByRating, toCardTool } from '../lib/tool-data';
import { COMPARATIFS_SEO_LINK_GROUPS } from '../lib/seo-internal-link-groups';
import { useT } from '../lib/i18n';

const DICT = {
  fr: {
    seoTitle: (y) => `Comparatifs outils ${y} : IA, VPN, hébergement`,
    seoDesc: (n) => `Comparez ${n} outils IA, VPN, hébergement web et sécurité : notes éditoriales, prix, essais gratuits et points forts.`,
    home: 'Accueil', comparisons: 'Comparatifs',
    badge: '⚖️ Comparatifs', h1: 'Comparez les meilleurs outils',
    subtitle: 'Notes éditoriales, prix, essais gratuits et comparatifs directs pour choisir sans se tromper.',
    popularDirect: 'Comparatifs directs populaires', compare: 'Comparer',
    affiliate: 'Certains liens peuvent être affiliés, sans coût supplémentaire pour vous. Les notes et verdicts restent éditoriaux.',
    searchPlaceholder: 'Rechercher un outil...',
    foundPlural: 'outils trouvés', foundSingular: 'outil trouvé', inCat: 'dans',
    noneInCat: 'Aucun outil dans cette catégorie.', showMore: (n) => `Afficher ${n} outils de plus`,
    catLabels: { 'Tout': 'Tout', 'VPN': 'VPN', 'Hébergement web': 'Hébergement web', 'Antivirus': 'Antivirus', 'Intelligence artificielle': 'Intelligence artificielle' },
    top: '🏆 Top', verified: '✓ Vérifié', trial: '🆓 Essai', ratingLabel: (v) => `Note éditoriale : ${v}/5`,
    seeProfile: 'Voir la fiche', officialSite: 'Site officiel',
    descs: {
      '/comparatifs/chatgpt-vs-claude': 'Assistant IA polyvalent ou analyse longue.',
      '/comparatifs/chatgpt-vs-gemini': 'Assistant polyvalent ou écosystème Google.',
      '/comparatifs/nordvpn-vs-surfshark': 'VPN premium ou meilleur prix multi-appareils.',
      '/comparatifs/hostinger-vs-o2switch': 'Petit prix international ou offre française simple.',
      '/comparatifs/ovhcloud-vs-hostinger': 'Souveraineté européenne ou rapport qualité-prix.',
      '/comparatifs/ovhcloud-vs-o2switch': 'Le duel des hébergeurs français.',
      '/comparatifs/claude-vs-gemini': 'Analyse de documents ou écosystème Google.',
      '/comparatifs/surfshark-vs-cyberghost': 'Appareils illimités ou streaming petit prix.',
      '/comparatifs/proton-vpn-vs-mullvad': 'Le duel de la confidentialité.',
      '/comparatifs/bitwarden-vs-1password': 'Open source ou expérience premium.',
      '/comparatifs/norton-vs-mcafee': 'Suite complète ou famille multi-appareils.',
      '/comparatifs/chatgpt-vs-perplexity': 'Création polyvalente ou recherche sourcée.',
      '/comparatifs/chatgpt-vs-mistral': 'Leader mondial ou alternative française.',
      '/comparatifs/nordvpn-vs-cyberghost': 'Performance premium ou petit prix streaming.',
      '/comparatifs/expressvpn-vs-surfshark': 'Simplicité premium ou rapport qualité-prix.',
      '/comparatifs/avast-vs-avg': 'Deux antivirus gratuits, un même moteur.',
      '/comparatifs/bitdefender-vs-kaspersky': 'Deux champions des labos de tests.',
      '/comparatifs/dashlane-vs-1password': 'Simplicité française ou référence premium.',
      '/comparatifs/hostinger-vs-siteground': 'Prix d’entrée ou premium WordPress.',
    },
  },
  en: {
    seoTitle: (y) => `Tool comparisons ${y}: AI, VPN, hosting`,
    seoDesc: (n) => `Compare ${n} AI, VPN, web hosting and security tools: editorial ratings, pricing, free trials and strengths.`,
    home: 'Home', comparisons: 'Comparisons',
    badge: '⚖️ Comparisons', h1: 'Compare the best tools',
    subtitle: 'Editorial ratings, pricing, free trials and direct comparisons to choose with confidence.',
    popularDirect: 'Popular head-to-head comparisons', compare: 'Compare',
    affiliate: 'Some links may be affiliated, at no extra cost to you. Ratings and verdicts stay editorial.',
    searchPlaceholder: 'Search for a tool...',
    foundPlural: 'tools found', foundSingular: 'tool found', inCat: 'in',
    noneInCat: 'No tool in this category.', showMore: (n) => `Show ${n} more tools`,
    catLabels: { 'Tout': 'All', 'VPN': 'VPN', 'Hébergement web': 'Web hosting', 'Antivirus': 'Antivirus', 'Intelligence artificielle': 'Artificial intelligence' },
    top: '🏆 Top', verified: '✓ Verified', trial: '🆓 Trial', ratingLabel: (v) => `Editorial rating: ${v}/5`,
    seeProfile: 'View details', officialSite: 'Official site',
    descs: {
      '/comparatifs/chatgpt-vs-claude': 'Versatile AI assistant or long-form analysis.',
      '/comparatifs/chatgpt-vs-gemini': 'Versatile assistant or Google ecosystem.',
      '/comparatifs/nordvpn-vs-surfshark': 'Premium VPN or best multi-device price.',
      '/comparatifs/hostinger-vs-o2switch': 'Low international price or simple French plan.',
      '/comparatifs/ovhcloud-vs-hostinger': 'European sovereignty or value for money.',
      '/comparatifs/ovhcloud-vs-o2switch': 'The French hosting showdown.',
      '/comparatifs/claude-vs-gemini': 'Document analysis or Google ecosystem.',
      '/comparatifs/surfshark-vs-cyberghost': 'Unlimited devices or low-cost streaming.',
      '/comparatifs/proton-vpn-vs-mullvad': 'The privacy showdown.',
      '/comparatifs/bitwarden-vs-1password': 'Open source or premium experience.',
      '/comparatifs/norton-vs-mcafee': 'Complete suite or multi-device family plan.',
      '/comparatifs/chatgpt-vs-perplexity': 'Versatile creation or sourced search.',
      '/comparatifs/chatgpt-vs-mistral': 'Global leader or French alternative.',
      '/comparatifs/nordvpn-vs-cyberghost': 'Premium performance or low-cost streaming.',
      '/comparatifs/expressvpn-vs-surfshark': 'Premium simplicity or value for money.',
      '/comparatifs/avast-vs-avg': 'Two free antivirus tools, one engine.',
      '/comparatifs/bitdefender-vs-kaspersky': 'Two lab-test champions.',
      '/comparatifs/dashlane-vs-1password': 'French simplicity or premium reference.',
      '/comparatifs/hostinger-vs-siteground': 'Entry price or premium WordPress.',
    },
  },
};

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return { props: { tools: sortByRating(tools).map(toCardTool) } };
}

const CATEGORIES = ['Tout', 'VPN', 'Hébergement web', 'Antivirus', 'Intelligence artificielle'];

const DIRECT_COMPARISONS = [
  { title: 'ChatGPT vs Claude', href: '/comparatifs/chatgpt-vs-claude', desc: 'Assistant IA polyvalent ou analyse longue.' },
  { title: 'ChatGPT vs Gemini', href: '/comparatifs/chatgpt-vs-gemini', desc: 'Assistant polyvalent ou écosystème Google.' },
  { title: 'NordVPN vs Surfshark', href: '/comparatifs/nordvpn-vs-surfshark', desc: 'VPN premium ou meilleur prix multi-appareils.' },
  { title: 'Hostinger vs o2switch', href: '/comparatifs/hostinger-vs-o2switch', desc: 'Petit prix international ou offre française simple.' },
  { title: 'OVHcloud vs Hostinger', href: '/comparatifs/ovhcloud-vs-hostinger', desc: 'Souveraineté européenne ou rapport qualité-prix.' },
  { title: 'OVHcloud vs o2switch', href: '/comparatifs/ovhcloud-vs-o2switch', desc: 'Le duel des hébergeurs français.' },
  { title: 'Claude vs Gemini', href: '/comparatifs/claude-vs-gemini', desc: 'Analyse de documents ou écosystème Google.' },
  { title: 'Surfshark vs CyberGhost', href: '/comparatifs/surfshark-vs-cyberghost', desc: 'Appareils illimités ou streaming petit prix.' },
  { title: 'Proton VPN vs Mullvad', href: '/comparatifs/proton-vpn-vs-mullvad', desc: 'Le duel de la confidentialité.' },
  { title: 'Bitwarden vs 1Password', href: '/comparatifs/bitwarden-vs-1password', desc: 'Open source ou expérience premium.' },
  { title: 'Norton vs McAfee', href: '/comparatifs/norton-vs-mcafee', desc: 'Suite complète ou famille multi-appareils.' },
  { title: 'ChatGPT vs Perplexity', href: '/comparatifs/chatgpt-vs-perplexity', desc: 'Création polyvalente ou recherche sourcée.' },
  { title: 'ChatGPT vs Mistral AI', href: '/comparatifs/chatgpt-vs-mistral', desc: 'Leader mondial ou alternative française.' },
  { title: 'NordVPN vs CyberGhost', href: '/comparatifs/nordvpn-vs-cyberghost', desc: 'Performance premium ou petit prix streaming.' },
  { title: 'ExpressVPN vs Surfshark', href: '/comparatifs/expressvpn-vs-surfshark', desc: 'Simplicité premium ou rapport qualité-prix.' },
  { title: 'Avast vs AVG', href: '/comparatifs/avast-vs-avg', desc: 'Deux antivirus gratuits, un même moteur.' },
  { title: 'Bitdefender vs Kaspersky', href: '/comparatifs/bitdefender-vs-kaspersky', desc: 'Deux champions des labos de tests.' },
  { title: 'Dashlane vs 1Password', href: '/comparatifs/dashlane-vs-1password', desc: 'Simplicité française ou référence premium.' },
  { title: 'Hostinger vs SiteGround', href: '/comparatifs/hostinger-vs-siteground', desc: 'Prix d’entrée ou premium WordPress.' },
];

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

function ToolCard({ tool, rank, t }) {
  const cat = tool.categories?.[0];
  const meta = CAT_META[cat] || CAT_META['Tout'];
  const affUrl = tool.affiliateUrl || tool.website || '#';

  return (
    <div
      className={`bg-white rounded-2xl flex flex-col overflow-hidden border-2 ${meta.border} hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group shadow-sm`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '360px' }}
    >
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
        <p className="text-gray-500 text-xs leading-relaxed text-center mb-4 line-clamp-2 flex-1">{tool.short || tool.highlight}</p>

        {/* Note */}
        {tool.rating && (
          <div className="flex flex-col items-center gap-1 mb-3">
            <Stars val={tool.rating.value} />
            <span className="text-xs text-gray-500">{t.ratingLabel(tool.rating.value)}</span>
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
            {t.seeProfile} <ArrowRight className="w-3 h-3" />
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
  const t = useT(DICT);
  const [selectedCat, setSelectedCat] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(TOOL_LIST_PAGE_SIZE);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filtered = useMemo(() => {
    const q = normalizeText(deferredSearchQuery.trim());
    return tools.filter(t => {
      if (!matchesMainCategory(t, selectedCat)) return false;
      if (!q) return true;
      return normalizeText(`${t.name} ${t.short || ''} ${t.highlight || ''}`).includes(q);
    });
  }, [deferredSearchQuery, selectedCat, tools]);

  const visibleTools = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(TOOL_LIST_PAGE_SIZE);
  }, [deferredSearchQuery, selectedCat]);

  const structuredData = useMemo(() => [
    buildBreadcrumbSchema([
      { name: t.home, url: '/' },
      { name: t.comparisons },
    ]),
    buildItemListSchema({
      name: 'Comparatifs outils tech',
      description: 'Comparatif des outils tech sélectionnés par Comparateur-Tech avec notes éditoriales, prix et essais.',
      items: tools,
    }),
  ], [tools]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.seoTitle(new Date().getFullYear())}
        description={t.seoDesc(tools.length)}
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
              {t.subtitle}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 py-10 sm:py-12">
          <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Scale className="w-5 h-5 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t.popularDirect}</h2>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {DIRECT_COMPARISONS.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl bg-gray-50 border border-gray-200 p-4 hover:border-purple-300 hover:bg-purple-50 transition-colors group">
                  <p className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1">{item.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{t.descs[item.href] || item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-700">{t.compare} <ArrowRight className="w-4 h-4" /></span>
                </Link>
              ))}
            </div>
          </section>

          <div className="mb-10">
            <SeoInternalLinks groups={COMPARATIFS_SEO_LINK_GROUPS} />
          </div>

          <section className="bg-purple-50 border border-purple-200 rounded-2xl p-4 sm:p-5 mb-8 text-sm text-purple-900">
            {t.affiliate}
          </section>

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
            <span className="text-purple-700 font-bold">{filtered.length}</span>{' '}{filtered.length > 1 ? t.foundPlural : t.foundSingular}
            {selectedCat !== 'Tout' && <> {t.inCat} <span className="text-purple-700 font-bold">{t.catLabels[selectedCat] || selectedCat}</span></>}
          </p>

          {/* Grille */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {visibleTools.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} rank={i} t={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t.noneInCat}</p>
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={() => setVisibleCount(count => count + TOOL_LIST_PAGE_SIZE)}
                className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all shadow-sm min-h-[48px]"
              >
                {t.showMore(Math.min(TOOL_LIST_PAGE_SIZE, filtered.length - visibleCount))}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
