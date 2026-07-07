import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Home, Search, ArrowRight } from 'lucide-react';
import { useT } from '../lib/i18n';

const CONTENT = {
  fr: {
    seoTitle: 'Page non trouvée, Comparateur-Tech', seoDescription: "Cette page n'existe pas.",
    h1: 'Page introuvable',
    intro: "Cette page n'existe pas ou a été déplacée. Explorez nos ressources ci-dessous !",
    backHome: "Retour à l'accueil", viewTools: 'Voir les outils',
    popularPages: 'Pages populaires',
  },
  en: {
    seoTitle: 'Page not found, Comparateur-Tech', seoDescription: 'This page does not exist.',
    h1: 'Page not found',
    intro: 'This page does not exist or has been moved. Explore our resources below!',
    backHome: 'Back to home', viewTools: 'View the tools',
    popularPages: 'Popular pages',
  },
};

export default function NotFound() {
  const t = useT(CONTENT);
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title={t.seoTitle} description={t.seoDescription} noindex />
      <Header />
      <main className="container mx-auto px-6 py-24 text-center">
        {/* Animated 404 */}
        <div className="relative inline-block mb-8">
          <div className="text-[10rem] font-black text-purple-100 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-7xl animate-float">🔍</div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t.h1}
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
          {t.intro}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/" className="gradient-purple text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
            <Home className="w-5 h-5" /> {t.backHome}
          </Link>
          <Link href="/outils" className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 shadow-sm">
            <Search className="w-5 h-5" /> {t.viewTools} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-sm max-w-xl mx-auto">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">{t.popularPages}</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/top-10-intelligence-artificielle', label: '🏆 Top 10 IA' },
              { href: '/top-10-vpn', label: '🏆 Top 10 VPN' },
              { href: '/comparatifs', label: '⚖️ Comparatifs' },
              { href: '/blog', label: '📰 Blog' },
              { href: '/newsletter', label: '📧 Newsletter' },
              { href: '/contact', label: '✉️ Contact' },
            ].map(link => (
              <Link key={link.href} href={link.href}
                className="flex items-center justify-center gap-2 bg-gray-50 border border-gray-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
