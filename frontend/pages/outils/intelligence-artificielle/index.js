import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SEO from '../../../components/SEO';
import { IA_SUBCATEGORIES } from '../../../lib/ia-subcategories';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const subcatCounts = {};
  IA_SUBCATEGORIES.forEach(sub => {
    subcatCounts[sub.slug] = allTools.filter(t => sub.tools.includes(t.name)).length;
  });
  return { props: { subcatCounts } };
}

export default function IAIndexPage({ subcatCounts }) {
  return (
    <>
      <SEO
        title="Intelligence artificielle – Types d'IA | Comparateur-Tech"
        description="Découvrez tous les types d'IA : rédaction, image, vidéo, recherche, agents et productivité."
        canonical="https://comparateur-tech.com/outils/intelligence-artificielle"
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
                <Link href="/" className="hover:text-gray-700 transition-colors">Accueil</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/outils" className="hover:text-gray-700 transition-colors">Outils</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 font-semibold">Intelligence artificielle</span>
              </nav>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-3xl">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
                  🤖
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {IA_SUBCATEGORIES.length} types d&apos;IA
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                    Intelligence artificielle
                  </h1>
                  <p className="text-gray-500 text-lg leading-relaxed">
                    Choisissez votre type d&apos;IA et découvrez les meilleurs outils sélectionnés par nos experts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* GRILLE */}
          <section className="container mx-auto px-4 sm:px-6 py-12 pb-24">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
              Quel type d&apos;IA recherchez-vous ?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {IA_SUBCATEGORIES.map((sub) => {
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
                          {count} outil{count > 1 ? 's' : ''}
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
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}
