import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { ArrowRight, CheckCircle2, Clock3, ShieldCheck, TrendingUp, User } from 'lucide-react';

const PATHS = [
  {
    title: 'Freelance & créateur',
    icon: User,
    desc: 'Priorisez la simplicité, la rapidité de prise en main et un coût mensuel maîtrisé.',
    links: [
      { label: 'Top 10 IA', href: '/top-10-intelligence-artificielle' },
      { label: 'Top 10 Hébergement', href: '/top-10-hebergement-web' },
    ],
  },
  {
    title: 'PME & e-commerce',
    icon: TrendingUp,
    desc: 'Misez sur la fiabilité, le support client et l’évolutivité pour accompagner votre croissance.',
    links: [
      { label: 'Comparatifs complets', href: '/comparatifs' },
      { label: 'Top 10 Antivirus', href: '/top-10-antivirus' },
    ],
  },
  {
    title: 'Usage sécurité & confidentialité',
    icon: ShieldCheck,
    desc: 'Analysez les politiques de données, la transparence des éditeurs et les options de sécurité.',
    links: [
      { label: 'Top 10 VPN', href: '/top-10-vpn' },
      { label: 'Tous les outils', href: '/outils' },
    ],
  },
];

const CHECKLIST = [
  'Définir votre budget maximum (mensuel ou annuel).',
  'Lister 3 besoins non négociables (ex: support FR, API, essai gratuit).',
  'Comparer au moins 2 outils sur une même catégorie.',
  'Tester l’outil final 7 jours avant engagement long terme.',
];

export default function CommencerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Commencer — Guide rapide pour choisir les bons outils | Comparateur-Tech"
        description="Un guide clair pour choisir vos outils IA, VPN, hébergement web et antivirus en moins de 15 minutes."
        canonical="https://comparateur-tech.com/commencer"
        keywords="guide outils IA, comment choisir un VPN, démarrer hébergement web, checklist outils"
      />
      <Header />
      <main>
        <section className="py-14 sm:py-20 bg-white border-b border-purple-100">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-5">
              <Clock3 className="w-4 h-4" />
              Méthode en 15 minutes
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Bien démarrer sur Comparateur-Tech</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Cette page vous aide à passer de “je ne sais pas quoi choisir” à “j’ai un outil adapté”
              avec une méthode simple, pratique et actionnable.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {PATHS.map(({ title, icon: Icon, desc, links }) => (
                <article key={title} className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm">
                  <div className="w-11 h-11 rounded-xl gradient-purple flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                  <p className="text-gray-600 text-sm mb-5">{desc}</p>
                  <div className="space-y-2">
                    {links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-800"
                      >
                        {item.label} <ArrowRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-white border border-purple-100 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Checklist décisionnelle</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-6">Copiez cette checklist avant de choisir votre prochain outil.</p>
              <ul className="space-y-3 mb-8">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/outils" className="gradient-purple text-white px-6 py-3 rounded-xl font-semibold inline-flex justify-center items-center gap-2">
                  Explorer les outils <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/newsletter" className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all inline-flex justify-center items-center">
                  Recevoir les mises à jour
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
