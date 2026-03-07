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

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return { props: { tools } };
}

const CATEGORIES = ['Tout', 'VPN', 'Hébergement web', 'Antivirus', 'Intelligence artificielle'];

const CAT_META_FILTER = {
  'Tout':                      { icon: '⭐' },
  'VPN':                       { icon: '🛡️' },
  'Hébergement web':           { icon: '🌐' },
  'Antivirus':                 { icon: '🦠' },
  'Intelligence artificielle': { icon: '🤖' },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org", "@type": "WebSite",
  "name": "Thecreamai", "url": "https://thecreamai.com",
  "publisher": { "@type": "Organization", "name": "Thecreamai" }
};

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
        canonical="https://thecreamai.com/"
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
                  <span>{CAT_META_FILTER[cat]?.icon}</span> {cat}
                </button>
              ))}
            </div>

            {/* Grille — 2 colonnes sur mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-7 sm:mb-10">
              {catTools.map((tool, i) => <ToolCard key={tool.id} tool={tool} />)}
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


      </main>
      <Footer />
    </div>
  );
}
