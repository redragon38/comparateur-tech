import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  cleanText,
  getAlternativePath,
  getCategoryPath,
  getComparisonBySlug,
  getComparisonPath,
  getRelatedTools,
  getToolPath,
  primaryCategory,
} from '../../lib/programmatic-seo';

function readTools() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export async function getServerSideProps({ params, res }) {
  const tools = readTools();
  const comparison = getComparisonBySlug(tools, params.slug);

  if (!comparison) {
    return { notFound: true };
  }

  const relatedA = getRelatedTools(tools, comparison.toolA, 5);
  const relatedB = getRelatedTools(tools, comparison.toolB, 5);
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');

  return {
    props: {
      toolA: comparison.toolA,
      toolB: comparison.toolB,
      category: comparison.category || primaryCategory(comparison.toolA),
      relatedComparisons: [...relatedA, ...relatedB]
        .filter((tool, index, list) => tool.id !== comparison.toolA.id && tool.id !== comparison.toolB.id && list.findIndex(item => item.id === tool.id) === index)
        .slice(0, 6),
    },
  };
}

function summary(tool) {
  return cleanText(tool.short || tool.highlight || `${tool.name} est une solution de la catégorie ${primaryCategory(tool)}.`);
}

function buildFaq(toolA, toolB, category) {
  return [
    {
      q: `${toolA.name} ou ${toolB.name} : lequel choisir ?`,
      a: `${toolA.name} est à privilégier si ses points forts correspondent mieux à votre usage prioritaire. ${toolB.name} doit être comparé si vous cherchez une approche, un prix ou des limites différentes en ${category}.`,
    },
    {
      q: `${toolA.name} et ${toolB.name} sont-ils dans la même catégorie ?`,
      a: `Oui, cette comparaison est limitée à des outils proches ou de même catégorie afin d’éviter un comparatif artificiel.`,
    },
    {
      q: `Quels critères regarder avant de décider ?`,
      a: `Comparez le prix, l’essai gratuit, la note éditoriale, les points forts, les limites, le support et les cas d’usage réels.`,
    },
  ];
}

export default function ComparisonPage({ toolA, toolB, category, relatedComparisons }) {
  const canonicalPath = getComparisonPath(toolA, toolB);
  const categoryPath = getCategoryPath(category);
  const faqs = buildFaq(toolA, toolB, category);
  const title = `${toolA.name} vs ${toolB.name} : lequel choisir ?`;
  const description = `Comparatif ${toolA.name} vs ${toolB.name} : prix, fonctionnalités, avantages, limites, cas d’usage et verdict pour choisir le meilleur outil ${category}.`;
  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Comparatifs', url: '/comparatifs' },
      { name: title },
    ]),
    buildFaqSchema(faqs),
  ];

  const rows = [
    ['Catégorie', category, category],
    ['Prix', toolA.price || 'À vérifier', toolB.price || 'À vérifier'],
    ['Essai gratuit', toolA.trial ? 'Oui' : 'Non / à vérifier', toolB.trial ? 'Oui' : 'Non / à vérifier'],
    ['Note éditoriale', toolA.rating?.value ? `${toolA.rating.value}/5` : 'Non noté', toolB.rating?.value ? `${toolB.rating.value}/5` : 'Non noté'],
    ['Point fort', cleanText(toolA.strengthShort?.[0] || toolA.highlight), cleanText(toolB.strengthShort?.[0] || toolB.highlight)],
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${title} | Comparateur-Tech`}
        description={description}
        canonical={`https://comparateur-tech.com${canonicalPath}`}
        structuredData={schemas}
      />
      <Header />
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-700">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/comparatifs" className="hover:text-purple-700">Comparatifs</Link>
          <span className="mx-2">/</span>
          <span>{toolA.name} vs {toolB.name}</span>
        </nav>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-3">Comparatif {category}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">{title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            {toolA.name} et {toolB.name} répondent à un besoin proche, mais leurs forces ne sont pas toujours les mêmes. Voici le comparatif utile pour trancher selon le prix, les limites, les fonctionnalités et votre contexte.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Résumé rapide</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[toolA, toolB].map(tool => (
                  <article key={tool.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{summary(tool)}</p>
                    <Link href={getToolPath(tool)} className="text-sm font-semibold text-purple-700 hover:underline">Voir la fiche {tool.name}</Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tableau comparatif</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500">Critère</th>
                      <th className="text-left px-4 py-3 text-gray-900">{toolA.name}</th>
                      <th className="text-left px-4 py-3 text-gray-900">{toolB.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row[0]} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-semibold text-gray-500">{row[0]}</td>
                        <td className="px-4 py-3 text-gray-700">{row[1]}</td>
                        <td className="px-4 py-3 text-gray-700">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Différences principales</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {toolA.name} se distingue surtout par {cleanText(toolA.strengthShort?.slice(0, 3).join(', ') || toolA.highlight || 'sa proposition principale')}. {toolB.name}, de son côté, mérite d’être étudié pour {cleanText(toolB.strengthShort?.slice(0, 3).join(', ') || toolB.highlight || 'son positionnement alternatif')}.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Le meilleur choix dépendra du niveau de fonctionnalités attendu, du prix réellement payé après promotion, du support et des contraintes propres à votre usage.
              </p>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verdict</h2>
              <p className="text-gray-700 leading-relaxed font-medium">
                Choisissez {toolA.name} si ses points forts correspondent à votre besoin prioritaire et si son tarif reste cohérent avec votre usage. Choisissez {toolB.name} si vous cherchez une alternative proche avec une approche, des limites ou un positionnement différent. Dans tous les cas, consultez les fiches détaillées avant de décider.
              </p>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Questions fréquentes</h2>
              <div className="space-y-4">
                {faqs.map(item => (
                  <div key={item.q} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Maillage interne</h2>
              <div className="space-y-3 text-sm">
                <Link href={getToolPath(toolA)} className="block font-semibold text-purple-700 hover:underline">Fiche {toolA.name}</Link>
                <Link href={getToolPath(toolB)} className="block font-semibold text-purple-700 hover:underline">Fiche {toolB.name}</Link>
                <Link href={getAlternativePath(toolA)} className="block text-gray-700 hover:text-purple-700">Alternatives à {toolA.name}</Link>
                <Link href={getAlternativePath(toolB)} className="block text-gray-700 hover:text-purple-700">Alternatives à {toolB.name}</Link>
                <Link href={categoryPath} className="block text-gray-700 hover:text-purple-700">Catégorie {category}</Link>
                {relatedComparisons.slice(0, 4).map(tool => (
                  <Link key={tool.id} href={getComparisonPath(toolA, tool)} className="block text-gray-700 hover:text-purple-700">{toolA.name} vs {tool.name}</Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
