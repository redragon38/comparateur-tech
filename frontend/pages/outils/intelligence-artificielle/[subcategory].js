import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ToolCard from '../../../components/ToolCard';
import SEO from '../../../components/SEO';
import { IA_SUBCATEGORIES } from '../../../lib/ia-subcategories';

export async function getStaticPaths() {
  const paths = IA_SUBCATEGORIES.map(sub => ({
    params: { subcategory: sub.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools.json');
  const allTools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const sub = IA_SUBCATEGORIES.find(s => s.slug === params.subcategory);
  if (!sub) return { notFound: true };

  const tools = allTools.filter(t => sub.tools.includes(t.name));

  // Autres sous-catégories pour la navigation
  const otherSubs = IA_SUBCATEGORIES
    .filter(s => s.slug !== params.subcategory)
    .map(s => ({
      ...s,
      count: allTools.filter(t => s.tools.includes(t.name)).length,
    }));

  return { props: { sub, tools, otherSubs } };
}

export default function IASubcategoryPage({ sub, tools, otherSubs }) {
  return (
    <>
      <SEO
        title={`${sub.label} – Meilleurs outils IA | Comparateur-Tech`}
        description={sub.desc}
        canonical={`https://comparateur-tech.com/outils/intelligence-artificielle/${sub.slug}`}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">

          {/* HERO */}
          <section className="relative py-16 sm:py-20 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 800px 400px at 50% -50px, ${sub.glow}, transparent)` }} />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">

              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
                <Link href="/" className="hover:text-gray-900 transition-colors">Accueil</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/outils" className="hover:text-gray-900 transition-colors">Outils</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/outils/intelligence-artificielle" className="hover:text-gray-900 transition-colors">Intelligence artificielle</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{sub.label}</span>
              </nav>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${sub.color} flex items-center justify-center text-4xl flex-shrink-0 shadow-2xl`}
                  style={{ boxShadow: `0 0 40px ${sub.glow}` }}>
                  {sub.icon}
                </div>
                <div>
                  <div className={`inline-block text-xs font-semibold tracking-widest uppercase ${sub.textColor} ${sub.bg} border ${sub.border} px-3 py-1 rounded-full mb-3`}>
                    {tools.length} outil{tools.length > 1 ? 's' : ''} disponible{tools.length > 1 ? 's' : ''}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                    {sub.label}
                  </h1>
                  <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">{sub.desc}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 pb-32">
            <div className="flex flex-col lg:flex-row gap-10">

              {/* SIDEBAR */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 sticky top-24">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Types d'IA</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/outils/intelligence-artificielle"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-purple-50 hover:text-purple-700 transition-all">
                        <span>🤖</span> Tous les types
                      </Link>
                    </li>
                    {IA_SUBCATEGORIES.map(s => {
                      const isActive = s.slug === sub.slug;
                      return (
                        <li key={s.slug}>
                          <Link
                            href={`/outils/intelligence-artificielle/${s.slug}`}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                              isActive
                                ? `${s.bg} ${s.textColor} border ${s.border} font-semibold`
                                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{s.icon}</span>
                              <span>{s.label}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Autres catégories</h3>
                    <ul className="space-y-1">
                      {[
                        { slug: 'hebergement-web', label: 'Hébergement web', icon: '🌐' },
                        { slug: 'vpn', label: 'VPN', icon: '🛡️' },
                        { slug: 'antivirus', label: 'Antivirus', icon: '🦠' },
                      ].map(cat => (
                        <li key={cat.slug}>
                          <Link href={`/outils/${cat.slug}`}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-all">
                            <span>{cat.icon}</span> {cat.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </aside>

              {/* CONTENU */}
              <div className="flex-1 min-w-0">

                {/* Description longue */}
                <div className={`border ${sub.border} ${sub.bg} rounded-2xl p-6 mb-8`}>
                  <p className={`${sub.textColor} leading-relaxed`}>{sub.longDesc}</p>
                </div>

                {/* Grille d'outils */}
                {tools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tools.map(tool => (
                      <ToolCard key={tool.id} tool={tool} onSelect={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-purple-100">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-gray-500 text-lg">Aucun outil dans cette catégorie pour l&apos;instant.</p>
                  </div>
                )}

                {/* Autres types d'IA */}
                {otherSubs.length > 0 && (
                  <div className="mt-16">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Autres types d'IA</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {otherSubs.map(s => (
                        <Link key={s.slug} href={`/outils/intelligence-artificielle/${s.slug}`}
                          className={`bg-white rounded-2xl border-2 ${s.border} p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            {s.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">{s.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{s.count} outil{s.count > 1 ? 's' : ''}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
