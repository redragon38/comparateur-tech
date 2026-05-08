import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ToolCard from '../../../components/ToolCard';
import SEO, { buildBreadcrumbSchema, buildFAQSchema, buildItemListSchema } from '../../../components/SEO';
import { IA_SUBCATEGORIES } from '../../../lib/ia-subcategories';

export async function getStaticPaths() {
  const paths = IA_SUBCATEGORIES.map(sub => ({
    params: { subcategory: sub.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
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

const IA_BUYER_CRITERIA = {
  redaction: ['Qualité du style en français', 'Longueur du contexte', 'Fiabilité des réponses', 'Export et intégrations'],
  image: ['Qualité visuelle', 'Contrôle du style', 'Droits d’usage', 'Coût par génération'],
  video: ['Qualité du mouvement', 'Durée des rendus', 'Contrôle caméra', 'Export professionnel'],
  audio: ['Naturel de la voix', 'Langues disponibles', 'Droits commerciaux', 'Temps de génération'],
  recherche: ['Sources citées', 'Fraîcheur des réponses', 'Synthèse', 'Export des recherches'],
  code: ['Qualité des suggestions', 'Confidentialité du code', 'IDE compatibles', 'Compréhension du contexte'],
  agent: ['Autonomie réelle', 'Connecteurs disponibles', 'Contrôle humain', 'Journalisation des actions'],
  productivite: ['Collaboration', 'Automatisations', 'Gestion des tâches', 'Rapports et tableaux de bord'],
};

function getSubcategoryCriteria(slug) {
  return IA_BUYER_CRITERIA[slug] || ['Qualité des résultats', 'Prix', 'Confidentialité', 'Intégrations'];
}

function buildSubcategoryFaq(sub, tools) {
  const topTools = tools.slice(0, 3).map(t => t.name).join(', ');
  return [
    {
      q: `Comment choisir un outil ${sub.label.toLowerCase()} ?`,
      a: `Comparez d’abord la qualité des résultats sur vos propres exemples, puis les limites du plan, la confidentialité des données et les intégrations avec vos outils existants.`,
    },
    {
      q: `Combien d’outils sont listés dans ${sub.label.toLowerCase()} ?`,
      a: `Cette sélection présente ${tools.length} outil${tools.length > 1 ? 's' : ''} pour ${sub.label.toLowerCase()}, avec accès aux fiches détaillées, prix, notes et alternatives.`,
    },
    {
      q: `Quels outils comparer en priorité ?`,
      a: topTools
        ? `Vous pouvez commencer par ${topTools}, puis comparer selon votre budget, le niveau de contrôle attendu et la qualité obtenue sur vos cas d’usage.`
        : `Commencez par les outils qui documentent clairement leurs limites, leurs prix et leurs conditions d’utilisation des données.`,
    },
  ];
}

export default function IASubcategoryPage({ sub, tools, otherSubs }) {
  const buyerCriteria = getSubcategoryCriteria(sub.slug);
  const subcategoryFaq = buildSubcategoryFaq(sub, tools);
  const structuredData = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Outils', url: '/outils' },
      { name: 'Intelligence artificielle', url: '/outils/intelligence-artificielle' },
      { name: sub.label },
    ]),
    buildItemListSchema({
      name: `Comparatif ${sub.label}`,
      description: sub.desc,
      items: tools,
    }),
    buildFAQSchema(subcategoryFaq),
  ];

  return (
    <>
      <SEO
        title={`${sub.label} – Comparatif & Avis 2026 | Comparateur-Tech`}
        description={`Comparez les meilleurs outils de ${sub.label.toLowerCase()} : ${sub.desc} ${tools.length} outil${tools.length > 1 ? 's' : ''} sélectionné${tools.length > 1 ? 's' : ''} par nos experts.`}
        canonical={`https://comparateur-tech.com/outils/intelligence-artificielle/${sub.slug}`}
        structuredData={structuredData}
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
                        { slug: 'cybersecurite', label: 'Cybersécurité', icon: '🔐' },
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

                <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Comment choisir une solution {sub.label.toLowerCase()} ?</h2>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    Testez toujours l’outil sur un exemple réel avant de comparer les prix. Les solutions IA peuvent sembler proches, mais elles diffèrent beaucoup sur la qualité, les limites d’usage et le contrôle du résultat.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {buyerCriteria.map(criterion => (
                      <div key={criterion} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <p className="text-sm font-semibold text-gray-800">{criterion}</p>
                      </div>
                    ))}
                  </div>
                </section>

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

                <section className="mt-12 bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Questions fréquentes</h2>
                  <div className="space-y-4">
                    {subcategoryFaq.map(item => (
                      <div key={item.q} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">{item.q}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>

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
