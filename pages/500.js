import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Home, RefreshCw } from 'lucide-react';

export default function ServerError() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Erreur serveur | Comparateur-Tech"
        description="Une erreur technique est survenue. Retrouvez les comparatifs, guides et fiches outils depuis la page d'accueil."
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
          Erreur technique temporaire
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
          La page n'a pas pu être chargée correctement. Vous pouvez revenir à l'accueil ou consulter le catalogue.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="gradient-purple text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2">
            <Home className="w-5 h-5" /> Retour à l'accueil
          </Link>
          <Link href="/outils" className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center">
            Voir les outils
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
