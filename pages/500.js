import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Home, RefreshCw } from 'lucide-react';
import { useT } from '../lib/i18n';

const CONTENT = {
  fr: {
    seoTitle: 'Erreur serveur | Comparateur-Tech',
    seoDescription: "Une erreur technique est survenue. Retrouvez les comparatifs, guides et fiches outils depuis la page d'accueil.",
    h1: 'Erreur technique temporaire',
    intro: "La page n'a pas pu être chargée correctement. Vous pouvez revenir à l'accueil ou consulter le catalogue.",
    backHome: "Retour à l'accueil", viewTools: 'Voir les outils',
  },
  en: {
    seoTitle: 'Server error | Comparateur-Tech',
    seoDescription: 'A technical error occurred. Find our comparisons, guides and tool pages from the home page.',
    h1: 'Temporary technical error',
    intro: 'The page could not be loaded correctly. You can return home or browse the catalog.',
    backHome: 'Back to home', viewTools: 'View the tools',
  },
};

export default function ServerError() {
  const t = useT(CONTENT);
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        canonical="https://comparateur-tech.com/500"
        noindex
        nofollow
      />
      <Header />
      <main className="container mx-auto px-6 py-24 text-center">
        <div className="relative inline-block mb-8">
          <div className="text-[10rem] font-black text-purple-100 leading-none select-none">500</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-16 h-16 text-purple-500" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t.h1}
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
          {t.intro}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="gradient-purple text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2">
            <Home className="w-5 h-5" /> {t.backHome}
          </Link>
          <Link href="/outils" className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center">
            {t.viewTools}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
