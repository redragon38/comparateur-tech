import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import WhySection from '../components/WhySection';
import TestimonialsSection from '../components/TestimonialsSection';
import FeaturesSection from '../components/FeaturesSection';
import NewsletterSection from '../components/NewsletterSection';
import SEO from '../components/SEO';
import { Star, ArrowRight, ExternalLink, Trophy, Search, Zap } from 'lucide-react';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return { props: { tools } };
}

const CATEGORIES = ['Tout', 'VPN', 'Hébergement web', 'Antivirus', 'Intelligence artificielle'];

const CAT_META = {
  'Tout':                      { icon: '⭐', accent: '#7c3aed', border: 'border-purple-200', topBar: 'bg-purple-500',  badge: 'bg-purple-50 border-purple-200 text-purple-700'  },
  'VPN':                       { icon: '🛡️', accent: '#2563eb', border: 'border-blue-200',   topBar: 'bg-blue-500',   badge: 'bg-blue-50 border-blue-200 text-blue-700'         },
  'Hébergement web':           { icon: '🌐', accent: '#059669', border: 'border-emerald-200',topBar: 'bg-emerald-500',badge: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  'Antivirus':                 { icon: '🦠', accent: '#dc2626', border: 'border-red-200',    topBar: 'bg-red-500',    badge: 'bg-red-50 border-red-200 text-red-700'             },
  'Intelligence artificielle': { icon: '🤖', accent: '#7c3aed', border: 'border-violet-200', topBar: 'bg-violet-500', badge: 'bg-violet-50 border-violet-200 text-violet-700'   },
};

const HOW_IT_WORKS = [
  { step: '1', icon: '🔍', title: 'Choisissez une catégorie', desc: 'VPN, IA, hébergement ou antivirus — trouvez ce qu\'il vous faut.' },
  { step: '2', icon: '⚖️', title: 'Comparez les outils', desc: 'Notes, prix, essais gratuits — toutes les infos pour décider.' },
  { step: '3', icon: '🚀', title: 'Accédez au meilleur prix', desc: 'Cliquez sur le lien officiel pour bénéficier des meilleures offres.' },
];

const STRUCTURED_DATA = {
  "@context": "https://schema.org", "@type": "WebSite",
  "name": "Thecreamai", "url": "https://thecreamai.com",
  "publisher": { "@type": "Organization", "name": "Thecreamai" }
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

function CompareCard({ tool, rank }) {
  const cat = tool.categories?.[0];
  const meta = CAT_META[cat] || CAT_META['Tout'];
  const url = tool.affiliateUrl || tool.website || '#';

  return (
    <div className={`bg-white rounded-2xl flex flex-col relative overflow-hidden border-2 ${meta.border} transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1`}>
      <div className={`h-1.5 w-full ${meta.topBar}`} />

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <Link href={`/tool/${tool.id}`} className="absolute inset-0 z-10" aria-label={`Voir ${tool.name}`} />

        {/* Rang + badge */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
            {rank + 1}
          </span>
          <div className="flex gap-1">
            {rank === 0 && <span className="text-xs bg-yellow-50 border border-yellow-300 text-yellow-700 px-2 py-0.5 rounded-full font-bold">🏆 Top</span>}
            {tool.verified && <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓</span>}
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
            {tool.logo ? (
              <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain p-2" loading="lazy"
                onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML=`<span class="text-3xl">${meta.icon}</span>`; }} />
            ) : <span className="text-3xl">{meta.icon}</span>}
          </div>
        </div>

        {/* Nom */}
        <h3 className="font-bold text-sm sm:text-base text-gray-900 text-center mb-1 group-hover:text-purple-700 transition-colors">{tool.name}</h3>

        {/* Tags */}
        <div className="flex justify-center gap-1 mb-2 sm:mb-3 flex-wrap">
          {tool.trial && <span className="text-xs bg-cyan-50 border border-cyan-200 text-cyan-700 px-2 py-0.5 rounded-full font-semibold">🆓 Essai</span>}
          {tool.price && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${meta.badge}`}>{tool.price}</span>}
        </div>

        {/* Description */}
        <p className="text-gray-500 text-xs leading-relaxed text-center mb-3 sm:mb-4 line-clamp-2 flex-1">{tool.short || tool.highlight}</p>

        {tool.rating && (
          <div className="flex flex-col items-center gap-1 mb-3 sm:mb-4">
            <Stars val={tool.rating.value} />
            <span className="text-xs text-gray-400">{tool.rating.value}/5 · {tool.rating.count} avis</span>
          </div>
        )}

        <div className="relative z-20 mt-auto">
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="w-full gradient-purple text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-300/50 transition-all min-h-[44px]">
            Voir le site <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home({ tools }) {
  const [selectedCat, setSelectedCat] = useState('Tout');

  const catTools = (selectedCat === 'Tout'
    ? tools
    : tools.filter(t => t.categories?.includes(selectedCat))
  ).sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0)).slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Thecreamai — Les Meilleurs Outils IA, VPN & Hébergement Web"
        description="Découvrez et comparez les meilleurs outils IA, VPN, hébergements web et antivirus. Sélection vérifiée et mise à jour par nos experts."
        canonical="https://thecreamai.com"
        structuredData={STRUCTURED_DATA}
      />
      <Header />
      <main>
        <HeroSection />

        {/* ── Comparatif ── */}
        <section className="py-12 sm:py-20 bg-white" id="comparatif">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-7 sm:mb-10">
              <span className="inline-block bg-purple-50 border border-purple-200 text-purple-700 px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">⚖️ Comparatif</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">Comparez les meilleurs outils</h2>
              <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base px-4">Sélectionnez une catégorie pour voir notre top sélection.</p>
            </div>

            {/* Filtres — scroll horizontal sur mobile */}
            <div className="scroll-x-mobile gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 mb-7 sm:mb-10 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCat(cat)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all text-sm whitespace-nowrap min-h-[44px] ${
                    selectedCat === cat
                      ? 'gradient-purple text-white shadow-lg shadow-purple-300/50 scale-105'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50'
                  }`}>
                  <span>{CAT_META[cat].icon}</span> {cat}
                </button>
              ))}
            </div>

            {/* Grille — 2 colonnes sur mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-7 sm:mb-10">
              {catTools.map((tool, i) => <CompareCard key={tool.id} tool={tool} rank={i} />)}
            </div>

            {/* CTAs */}
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

        {/* Features / Méthode */}
        <FeaturesSection />

        {/* Why Section */}
        <WhySection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Newsletter */}
        <NewsletterSection />

        {/* CTA final */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Prêt à trouver votre outil idéal ?</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Explorez nos 32 outils vérifiés et prenez la meilleure décision pour votre activité.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/outils" className="gradient-purple text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-300/50 hover:shadow-purple-400/60 hover:-translate-y-1 transition-all inline-flex items-center gap-2">
                <Zap className="w-5 h-5" /> Explorer tous les outils
              </Link>
              <Link href="/top-10-intelligence-artificielle" className="bg-white border-2 border-purple-200 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:border-purple-400 hover:bg-purple-50 hover:-translate-y-1 transition-all inline-flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-600" /> Voir le Top 10
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
