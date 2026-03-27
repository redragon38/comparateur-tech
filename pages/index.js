import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import ToolCard from '../components/ToolCard';
import SEO from '../components/SEO';
import { ArrowRight, BookOpen, Trophy, Sparkles, ShieldCheck, Rocket } from 'lucide-react';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
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

const QUICK_START_STEPS = [
  {
    icon: Sparkles,
    title: 'Définissez votre besoin',
    desc: 'Commencez par votre objectif : créer du contenu, sécuriser vos données, ou héberger un site rapidement.',
    cta: 'Découvrir les catégories',
    href: '/outils',
  },
  {
    icon: ShieldCheck,
    title: 'Comparez les alternatives',
    desc: 'Consultez nos comparatifs et scores pour voir les points forts et limites de chaque outil en un coup d’œil.',
    cta: 'Voir les comparatifs',
    href: '/comparatifs',
  },
  {
    icon: Rocket,
    title: 'Passez à l’action',
    desc: 'Utilisez notre guide de démarrage pour choisir un outil en moins de 15 minutes, selon votre profil.',
    cta: 'Lire le guide',
    href: '/commencer',
  },
];

const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Comparateur-Tech",
    "url": "https://comparateur-tech.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": { "@type": "EntryPoint", "urlTemplate": "https://comparateur-tech.com/outils?q={search_term_string}" },
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Comparateur-Tech",
    "url": "https://comparateur-tech.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://comparateur-tech.com/logo.png",
      "width": 200,
      "height": 60
    },
    "sameAs": [],
    "description": "Plateforme de comparaison des meilleurs outils IA, VPN, hébergements web et antivirus. Sélection vérifiée par des experts.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://comparateur-tech.com/contact"
    }
  }
];

export default function Home({ tools }) {
  const [selectedCat, setSelectedCat] = useState('Tout');

  const catTools = (selectedCat === 'Tout'
    ? tools
    : tools.filter(t => t.categories?.includes(selectedCat))
  ).sort((a, b) => (b.rating?.value || 0) - (a.rating?.value || 0)).slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Comparateur-Tech — Les Meilleurs Outils IA, VPN & Hébergement Web"
        description="Comparez les meilleurs outils IA, VPN, hébergements web et antivirus en 2025. Avis experts, prix et classements vérifiés pour vous aider à choisir."
        canonical="https://comparateur-tech.com/"
        keywords="comparateur outils IA, meilleur VPN 2025, hébergement web pas cher, antivirus gratuit, outils intelligence artificielle"
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
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-7 sm:mb-10">
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

        <section className="py-14 sm:py-20 bg-gray-50 border-y border-purple-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <span className="inline-flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4">
                <BookOpen className="w-4 h-4" />
                Démarrage rapide
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Un parcours simple pour mieux choisir</h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">Que vous soyez freelance, PME ou créateur, suivez ces 3 étapes pour éviter les mauvais choix.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {QUICK_START_STEPS.map(({ icon: Icon, title, desc, cta, href }) => (
                <article key={title} className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="w-11 h-11 rounded-xl gradient-purple flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{desc}</p>
                  <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-800">
                    {cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-white p-7 sm:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <span className="inline-block bg-white border border-purple-200 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">Nouveau guide</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Vous démarrez aujourd’hui ? On vous guide pas à pas.</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Nous avons ajouté une nouvelle page “Commencer” avec une checklist décisionnelle, des erreurs à éviter et des parcours par profil.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/commencer" className="gradient-purple text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2">
                    Ouvrir le guide <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/temoignages" className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all inline-flex items-center justify-center gap-2">
                    Lire les témoignages
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
