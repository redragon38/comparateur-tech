import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useT } from '../lib/i18n';

const STEP_STYLE = ['🔍', '🧪', '📊', '✅'];

const CONTENT = {
  fr: {
    seoTitle: 'Pourquoi choisir Comparateur-Tech',
    seoDescription: 'Découvrez comment Comparateur-Tech sélectionne les meilleurs outils du web : méthode de test, critères de notation, valeurs et indépendance éditoriale.',
    badge: '💎 Pourquoi nous choisir',
    h1a: 'Des recommandations en qui', h1b: 'vous pouvez avoir confiance',
    intro: 'Chaque outil que vous trouvez sur Comparateur-Tech a été testé, évalué et approuvé selon des critères stricts. Voici comment on travaille.',
    processTitle: 'Notre processus en 4 étapes',
    steps: [
      { title: 'Recherche & veille', desc: "Notre équipe scrute en permanence le marché pour repérer les meilleurs outils, qu'ils soient émergents ou établis." },
      { title: 'Tests manuels', desc: "Chaque outil est installé et testé sur de vraies conditions d'utilisation pendant plusieurs semaines." },
      { title: 'Notation objective', desc: 'On attribue une note basée sur des critères précis : performance, prix, support, interface, fiabilité.' },
      { title: 'Publication & mise à jour', desc: 'On publie uniquement ce qui dépasse la barre, et on réévalue régulièrement chaque outil.' },
    ],
    criteriaTitle: 'Nos critères de notation',
    criteriaIntro: 'Chaque outil est évalué selon 8 critères objectifs. Pas de coup de cœur subjectif, pas de favoritisme, seulement des données et des tests réels.',
    criteria: [
      'Performance et rapidité réelle', 'Rapport qualité-prix', 'Qualité du support client',
      'Facilité de prise en main', 'Fiabilité sur la durée', 'Satisfaction communauté',
      'Fréquence des mises à jour', 'Politique de remboursement',
    ],
    exampleTitle: 'Exemple de notation',
    exampleBars: [
      { label: 'Performance', val: 95 },
      { label: 'Rapport qualité-prix', val: 88 },
      { label: 'Support client', val: 82 },
      { label: 'Interface', val: 91 },
      { label: 'Fiabilité', val: 97 },
    ],
    valuesTitle: 'Nos valeurs',
    values: [
      { icon: '🔒', title: 'Indépendance éditoriale', desc: 'Nos recommandations ne sont jamais influencées par des partenariats commerciaux. Les meilleurs outils sont mis en avant, point.' },
      { icon: '💡', title: 'Transparence totale', desc: "Nos critères de notation sont publics. Vous savez toujours pourquoi on recommande un outil plutôt qu'un autre." },
      { icon: '⚡', title: 'Mise à jour continue', desc: 'Le marché évolue vite. On réévalue nos recommandations tous les trimestres pour vous garantir une info à jour.' },
      { icon: '🎯', title: 'Centrés sur votre usage', desc: 'On sélectionne des outils pour des créateurs et entrepreneurs, pas pour des grandes entreprises. Notre audience, notre priorité.' },
    ],
    ctaTitle: 'Convaincu ? Découvrez nos sélections',
    ctaText: 'Plus de 32 outils vérifiés, organisés par catégorie pour faciliter votre choix.',
    ctaTools: 'Voir tous les outils →',
    ctaComparisons: 'Voir les comparatifs',
  },
  en: {
    seoTitle: 'Why choose Comparateur-Tech',
    seoDescription: 'Discover how Comparateur-Tech selects the best tools on the web: testing method, rating criteria, values and editorial independence.',
    badge: '💎 Why choose us',
    h1a: 'Recommendations you', h1b: 'can actually trust',
    intro: 'Every tool you find on Comparateur-Tech has been tested, evaluated and approved against strict criteria. Here is how we work.',
    processTitle: 'Our 4-step process',
    steps: [
      { title: 'Research & monitoring', desc: 'Our team constantly scans the market to spot the best tools, whether emerging or established.' },
      { title: 'Manual testing', desc: 'Every tool is installed and tested in real usage conditions for several weeks.' },
      { title: 'Objective rating', desc: 'We assign a score based on precise criteria: performance, price, support, interface, reliability.' },
      { title: 'Publication & updates', desc: 'We only publish what clears the bar, and we re-evaluate each tool regularly.' },
    ],
    criteriaTitle: 'Our rating criteria',
    criteriaIntro: 'Every tool is evaluated against 8 objective criteria. No subjective favorites, no favoritism, only data and real tests.',
    criteria: [
      'Real performance and speed', 'Value for money', 'Customer support quality',
      'Ease of use', 'Long-term reliability', 'Community satisfaction',
      'Update frequency', 'Refund policy',
    ],
    exampleTitle: 'Sample rating',
    exampleBars: [
      { label: 'Performance', val: 95 },
      { label: 'Value for money', val: 88 },
      { label: 'Customer support', val: 82 },
      { label: 'Interface', val: 91 },
      { label: 'Reliability', val: 97 },
    ],
    valuesTitle: 'Our values',
    values: [
      { icon: '🔒', title: 'Editorial independence', desc: 'Our recommendations are never influenced by commercial partnerships. The best tools are highlighted, period.' },
      { icon: '💡', title: 'Full transparency', desc: 'Our rating criteria are public. You always know why we recommend one tool over another.' },
      { icon: '⚡', title: 'Continuous updates', desc: 'The market moves fast. We re-evaluate our recommendations every quarter to guarantee up-to-date information.' },
      { icon: '🎯', title: 'Focused on your use case', desc: 'We select tools for creators and entrepreneurs, not for large enterprises. Our audience, our priority.' },
    ],
    ctaTitle: 'Convinced? Discover our selections',
    ctaText: 'More than 32 verified tools, organized by category to make your choice easier.',
    ctaTools: 'See all tools →',
    ctaComparisons: 'See the comparisons',
  },
};

export default function PourquoiNousPage() {
  const t = useT(CONTENT);

  return (
    <div className="min-h-screen">
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        canonical="https://comparateur-tech.com/pourquoi-nous"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative py-24 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <span className="inline-block bg-purple-900/30 border border-purple-500/30 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              {t.badge}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
              {t.h1a}<br />
              <span className="text-gray-900">{t.h1b}</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              {t.intro}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 pb-24">

          {/* Notre processus */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">{t.processTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.steps.map((step, i) => (
                <div key={i} className="gradient-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-2 hover:border-purple-500/50 transition-all">
                  <div className="absolute -top-3 -right-3 text-6xl font-black text-gray-900/30">{String(i + 1).padStart(2, '0')}</div>
                  <div className="text-4xl mb-4">{STEP_STYLE[i]}</div>
                  <h3 className="font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Critères de notation */}
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">{t.criteriaTitle}</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {t.criteriaIntro}
                </p>
                <ul className="space-y-3">
                  {t.criteria.map((c, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0" />
                      <span className="text-gray-900">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="gradient-card rounded-2xl p-8">
                <h3 className="font-bold text-xl mb-6">{t.exampleTitle}</h3>
                {t.exampleBars.map((item, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-900">{item.label}</span>
                      <span className="text-gray-900 font-bold">{item.val}/100</span>
                    </div>
                    <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
                      <div className="h-full gradient-purple rounded-full transition-all" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Nos valeurs */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">{t.valuesTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.values.map((v, i) => (
                <div key={i} className="gradient-card rounded-2xl p-7 flex gap-5 hover:border-purple-500/50 hover:-translate-y-1 transition-all">
                  <div className="text-4xl flex-shrink-0">{v.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="relative gradient-card rounded-3xl p-12 text-center border-purple-500/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-3">{t.ctaTitle}</h2>
              <p className="text-gray-900 mb-8 max-w-md mx-auto">{t.ctaText}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/outils" className="gradient-purple text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/40 hover:-translate-y-0.5 transition-all">
                  {t.ctaTools}
                </Link>
                <Link href="/comparatifs" className="gradient-card border border-purple-500/30 text-gray-900 px-10 py-4 rounded-xl font-semibold hover:border-purple-500/60 hover:-translate-y-0.5 transition-all">
                  {t.ctaComparisons}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
