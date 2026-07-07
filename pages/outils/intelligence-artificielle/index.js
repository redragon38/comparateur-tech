import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SEO, { buildBreadcrumbSchema, buildFAQSchema } from '../../../components/SEO';
import { IA_SUBCATEGORIES, localizeSubcat } from '../../../lib/ia-subcategories';
import { useT, useLocale } from '../../../lib/i18n';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const subcatCounts = {};
  IA_SUBCATEGORIES.forEach(sub => {
    subcatCounts[sub.slug] = allTools.filter(t => sub.tools.includes(t.name)).length;
  });
  return { props: { subcatCounts } };
}

const CONTENT = {
  fr: {
    seoTitle: 'Meilleurs outils IA 2026 : comparatif par usage',
    seoDescription: 'Comparez les outils IA par usage : rédaction, image, vidéo, recherche, agents, productivité, audio et code. Sélection éditoriale mise à jour.',
    home: 'Accueil',
    tools: 'Outils',
    ai: 'Intelligence artificielle',
    typesCount: (n) => `${n} types d'IA`,
    h1: 'Intelligence artificielle',
    intro: "Choisissez votre type d'IA et découvrez les meilleurs outils sélectionnés par nos experts.",
    howToChoose: 'Comment choisir un outil IA ?',
    howToChooseIntro: "Le bon outil dépend d'abord de la tâche à automatiser. Une IA de rédaction, un générateur d'images, un assistant de code et un agent autonome ne se comparent pas avec les mêmes critères.",
    criteria: ['Qualité des résultats en français', 'Confidentialité des données', 'Limites du plan gratuit ou payant', 'Intégrations avec vos outils'],
    whichType: "Quel type d'IA recherchez-vous ?",
    toolCount: (n) => `${n} outil${n > 1 ? 's' : ''}`,
    faqTitle: 'Questions fréquentes sur les outils IA',
    faq: [
      { q: "Quel type d'outil IA choisir en premier ?", a: 'Commencez par le besoin le plus fréquent : rédaction, image, recherche, code, vidéo, audio, agent ou productivité. Un outil excellent dans un usage peut être moyen dans un autre.' },
      { q: 'Comment comparer deux outils IA ?', a: "Utilisez un même exemple de test, comparez la qualité du résultat, les limites, la confidentialité, le prix réel et la facilité d'intégration dans votre flux de travail." },
      { q: 'Les outils IA gratuits suffisent-ils ?', a: "Ils suffisent souvent pour tester ou produire ponctuellement, mais les plans payants apportent généralement plus de contexte, de vitesse, de confidentialité ou de droits d'usage." },
    ],
  },
  en: {
    seoTitle: 'Best AI tools 2026: comparison by use case',
    seoDescription: 'Compare AI tools by use case: writing, image, video, research, agents, productivity, audio and code. Editorial selection kept up to date.',
    home: 'Home',
    tools: 'Tools',
    ai: 'Artificial intelligence',
    typesCount: (n) => `${n} AI types`,
    h1: 'Artificial intelligence',
    intro: 'Pick your AI type and discover the best tools selected by our experts.',
    howToChoose: 'How to choose an AI tool?',
    howToChooseIntro: 'The right tool depends first on the task to automate. An AI writer, an image generator, a code assistant and an autonomous agent are not compared with the same criteria.',
    criteria: ['Output quality in English', 'Data privacy', 'Free or paid plan limits', 'Integrations with your tools'],
    whichType: 'Which type of AI are you looking for?',
    toolCount: (n) => `${n} tool${n > 1 ? 's' : ''}`,
    faqTitle: 'Frequently asked questions about AI tools',
    faq: [
      { q: 'Which type of AI tool should I choose first?', a: 'Start with your most frequent need: writing, image, research, code, video, audio, agent or productivity. A tool that excels at one use case can be average at another.' },
      { q: 'How do I compare two AI tools?', a: 'Use the same test example, then compare output quality, limits, privacy, the real price and how easily it integrates into your workflow.' },
      { q: 'Are free AI tools enough?', a: 'They are often enough to test or produce occasionally, but paid plans generally offer more context, speed, privacy or usage rights.' },
    ],
  },
};

export default function IAIndexPage({ subcatCounts }) {
  const t = useT(CONTENT);
  const locale = useLocale();
  const subcategories = IA_SUBCATEGORIES.map((sub) => localizeSubcat(sub, locale));

  return (
    <>
      <SEO
        title={t.seoTitle}
        description={t.seoDescription}
        canonical="https://comparateur-tech.com/outils/intelligence-artificielle"
        structuredData={[
          buildBreadcrumbSchema([
            { name: t.home, url: '/' },
            { name: t.tools, url: '/outils' },
            { name: t.ai },
          ]),
          buildFAQSchema(t.faq),
        ]}
      />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">

          {/* HERO */}
          <section className="relative py-16 sm:py-20 overflow-hidden bg-white border-b border-gray-100">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 900px 500px at 60% -100px, rgba(139,92,246,0.08), transparent)' }} />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10 flex-wrap">
                <Link href="/" className="hover:text-gray-700 transition-colors">{t.home}</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/outils" className="hover:text-gray-700 transition-colors">{t.tools}</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 font-semibold">{t.ai}</span>
              </nav>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-3xl">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
                  🤖
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {t.typesCount(subcategories.length)}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                    {t.h1}
                  </h1>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    {t.intro}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* GRILLE */}
          <section className="container mx-auto px-4 sm:px-6 py-12 pb-24">
            <div className="bg-white border border-purple-100 rounded-2xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t.howToChoose}</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                {t.howToChooseIntro}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {t.criteria.map(criterion => (
                  <div key={criterion} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">{criterion}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              {t.whichType}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {subcategories.map((sub) => {
                const count = subcatCounts[sub.slug] || 0;
                return (
                  <Link
                    key={sub.slug}
                    href={`/outils/intelligence-artificielle/${sub.slug}`}
                    className="group relative bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2"
                    style={{
                      border: `1px solid ${sub.borderCss}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = `0 12px 36px ${sub.glow}, 0 2px 8px rgba(0,0,0,0.06)`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)';
                    }}
                  >
                    {/* Barre top */}
                    <div className={`h-[3px] w-full bg-gradient-to-r ${sub.color}`} />

                    {/* Fond hover */}
                    <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(180deg, ${sub.bgCss} 0%, transparent 100%)` }} />

                    <div className="relative p-6 flex flex-col gap-5 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${sub.twBg}`}
                          style={{ border: `1.5px solid ${sub.borderCss}`, boxShadow: `0 4px 14px ${sub.glow}` }}
                        >
                          {sub.icon}
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                          style={{ color: sub.textCss, background: sub.bgCss, border: `1px solid ${sub.borderCss}` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sub.textCss, opacity: 0.6 }} />
                          {t.toolCount(count)}
                        </div>
                      </div>

                      {/* Texte */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-snug">{sub.label}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{sub.desc}</p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex gap-1.5 flex-wrap">
                          {sub.tools.slice(0, 2).map(name => (
                            <span key={name} className="text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                              {name}
                            </span>
                          ))}
                          {sub.tools.length > 2 && (
                            <span className="text-[10px] font-medium text-gray-300 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                              +{sub.tools.length - 2}
                            </span>
                          )}
                        </div>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110 text-white"
                          style={{ background: `linear-gradient(135deg, ${sub.glowHex}, ${sub.glowHex}cc)` }}>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="bg-white border border-purple-100 rounded-2xl shadow-sm p-6 mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-5">{t.faqTitle}</h2>
              <div className="space-y-4">
                {t.faq.map(item => (
                  <div key={item.q} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{item.q}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}
