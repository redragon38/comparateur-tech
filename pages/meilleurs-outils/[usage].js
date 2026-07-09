import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildItemListSchema,
  cleanText,
  getAlternativePath,
  getCategoryPath,
  getComparisonPath,
  getUsecaseBySlug,
  getUsecaseTools,
  getToolPath,
} from '../../lib/programmatic-seo';

function readTools() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export async function getServerSideProps({ params, res }) {
  const tools = readTools();
  const usecase = getUsecaseBySlug(params.usage);
  const selectedTools = getUsecaseTools(tools, usecase, 8);

  if (!usecase || selectedTools.length < 5) {
    return { notFound: true };
  }

  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');

  return {
    props: {
      usecase,
      tools: selectedTools,
    },
  };
}

function buildFaq(usecase, tools) {
  return [
    {
      q: `Quel est le meilleur choix parmi les ${usecase.title.toLowerCase()} ?`,
      a: `${tools[0].name} fait partie des premiers outils à comparer, mais le meilleur choix dépend surtout de vos contraintes : ${usecase.criteria.slice(0, 4).join(', ')}.`,
    },
    {
      q: `Faut-il choisir uniquement l’outil le mieux noté ?`,
      a: `Non. La note aide à trier, mais il faut aussi vérifier le prix, l’essai gratuit, les limites et l’adéquation avec votre usage réel.`,
    },
    {
      q: `Comment comparer ces outils rapidement ?`,
      a: `Commencez par deux ou trois options, lisez leurs fiches détaillées, puis comparez les fonctionnalités indispensables, le support, les conditions tarifaires et les alternatives proches.`,
    },
  ];
}

export default function BestToolsPage({ usecase, tools }) {
  const canonicalPath = `/meilleurs-outils/${usecase.slug}`;
  const categoryPath = getCategoryPath(usecase.category);
  const faqs = buildFaq(usecase, tools);
  const description = `${usecase.title} : classement, prix, critères de choix, tableau comparatif, FAQ et liens vers les fiches détaillées.`;
  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Meilleurs outils', url: '/guides' },
      { name: usecase.title },
    ]),
    buildItemListSchema(usecase.title, description, tools),
    buildFaqSchema(faqs),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${usecase.title} en 2026 | Comparateur-Tech`}
        description={description}
        canonical={`https://comparateur-tech.com${canonicalPath}`}
        structuredData={schemas}
      />
      <Header />
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-700">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/guides" className="hover:text-purple-700">Guides</Link>
          <span className="mx-2">/</span>
          <span>{usecase.title}</span>
        </nav>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-3">Guide d’achat</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">{usecase.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            Ce classement rassemble les outils les plus pertinents pour ce besoin. L’objectif n’est pas de choisir le plus connu, mais celui qui colle le mieux à vos critères : {usecase.criteria.slice(0, 5).join(', ')}.
          </p>
          <div className="mt-6">
            <Link href={categoryPath} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-purple-300">Voir la catégorie {usecase.category}</Link>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section id="classement" className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Classement des outils</h2>
              {tools.map((tool, index) => (
                <article key={tool.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">{index + 1}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{cleanText(tool.short || tool.highlight)}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <Link href={getToolPath(tool)} className="font-semibold text-purple-700 hover:underline">Voir la fiche</Link>
                        <Link href={getAlternativePath(tool)} className="font-semibold text-gray-700 hover:text-purple-700">Alternatives</Link>
                        {tools[index + 1] && <Link href={getComparisonPath(tool, tools[index + 1])} className="font-semibold text-gray-700 hover:text-purple-700">Comparer avec {tools[index + 1].name}</Link>}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tableau comparatif</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[780px] text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500">Outil</th>
                      <th className="text-left px-4 py-3 text-gray-500">Prix</th>
                      <th className="text-left px-4 py-3 text-gray-500">Essai</th>
                      <th className="text-left px-4 py-3 text-gray-500">Note</th>
                      <th className="text-left px-4 py-3 text-gray-500">Point fort</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.map(tool => (
                      <tr key={tool.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-bold text-gray-900">{tool.name}</td>
                        <td className="px-4 py-3 text-gray-600">{tool.price || 'À vérifier'}</td>
                        <td className="px-4 py-3 text-gray-600">{tool.trial ? 'Oui' : 'Non / à vérifier'}</td>
                        <td className="px-4 py-3 text-gray-600">{tool.rating?.value ? `${tool.rating.value}/5` : 'Non noté'}</td>
                        <td className="px-4 py-3 text-gray-600">{cleanText(tool.strengthShort?.[0] || tool.highlight || tool.short)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Critères de choix</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {usecase.criteria.map(criterion => (
                  <div key={criterion} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="font-semibold text-gray-800">{criterion}</p>
                  </div>
                ))}
              </div>
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
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Liens utiles</h2>
              <div className="space-y-3 text-sm">
                <Link href={categoryPath} className="block font-semibold text-purple-700 hover:underline">Catégorie {usecase.category}</Link>
                {tools.slice(0, 5).map(tool => <Link key={tool.id} href={getToolPath(tool)} className="block text-gray-700 hover:text-purple-700">Fiche {tool.name}</Link>)}
                {tools.slice(0, 3).map(tool => <Link key={`alt-${tool.id}`} href={getAlternativePath(tool)} className="block text-gray-700 hover:text-purple-700">Alternatives à {tool.name}</Link>)}
              </div>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
