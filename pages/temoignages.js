import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { ArrowRight, MessageSquare } from 'lucide-react';

const USE_CASES = [
  { title: 'Choisir un outil IA', desc: 'Comparer ChatGPT, Claude, Gemini ou Perplexity selon le besoin : rédaction, recherche, cours, code ou productivité.', href: '/comparatifs/chatgpt-vs-claude' },
  { title: 'Trouver un VPN adapté', desc: 'Comparer prix, vitesse, confidentialité, streaming et nombre d’appareils avant de choisir.', href: '/comparatifs/nordvpn-vs-surfshark' },
  { title: 'Héberger un site WordPress', desc: 'Identifier le bon hébergeur selon le budget, le support, la vitesse et la simplicité.', href: '/guides/meilleur-hebergement-wordpress' },
];

const STATS = [
  { number: '100+', label: 'Outils analysés' },
  { number: '5', label: 'Catégories principales' },
  { number: 'Éditorial', label: 'Notes et verdicts' },
  { number: '2026', label: 'Guides mis à jour' },
];

export default function TemoignagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Retours lecteurs & cas d’usage | Comparateur-Tech"
        description="Découvrez comment utiliser Comparateur-Tech pour choisir un outil IA, un VPN, un hébergement web ou une solution de sécurité."
        canonical="https://comparateur-tech.com/temoignages"
      />
      <Header />
      <main>
        <section className="relative py-20 text-center bg-gradient-to-b from-purple-50 to-white border-b border-purple-100">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <span className="inline-flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <MessageSquare className="w-4 h-4" /> Retours lecteurs
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight text-gray-900">
              Une page prête pour vos vrais témoignages
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Cette page reste disponible, mais elle évite d’afficher de faux avis. Elle pourra accueillir des retours vérifiés lorsque vous aurez assez de lecteurs et de clics mensuels.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">{s.number}</div>
                <div className="text-gray-500 text-xs sm:text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">À afficher plus tard</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Quand vous aurez de vrais retours, ajoutez des témoignages avec prénom, contexte, date et usage précis. Cela renforcera la confiance sans risquer de donner une impression artificielle.
            </p>
            <div className="rounded-2xl bg-purple-50 border border-purple-200 p-5 text-sm text-purple-900">
              Format conseillé : “J’ai utilisé Comparateur-Tech pour comparer [outil A] et [outil B]. La page m’a aidé à choisir parce que [raison concrète].”
            </div>
          </section>

          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Par où commencer ?</h2>
              <p className="text-gray-500">Quelques parcours utiles pour les visiteurs qui arrivent depuis Google.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {USE_CASES.map((item) => (
                <Link key={item.href} href={item.href} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-purple-300 hover:bg-purple-50 transition-colors group">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-purple-700">Voir le guide <ArrowRight className="w-4 h-4" /></span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
