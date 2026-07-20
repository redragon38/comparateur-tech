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
import {
  buildComparisonFaq,
  buildComparisonSeoModel,
  buildHowToSchema,
  buildItemListFromLinks,
  buildProductSchema,
  variant,
} from '../../lib/premium-seo';

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
  return cleanText(tool.short || tool.highlight || `${tool.name} est une solution de la categorie ${primaryCategory(tool)}.`);
}

function scoreLabel(tool, fallback) {
  return tool.rating?.value ? `${tool.rating.value}/5` : fallback;
}

export default function ComparisonPage({ toolA, toolB, category, relatedComparisons }) {
  const canonicalPath = getComparisonPath(toolA, toolB);
  const categoryPath = getCategoryPath(category);
  const seo = buildComparisonSeoModel(toolA, toolB, category);
  const faqs = buildComparisonFaq(toolA, toolB, category);
  const criteria = seo.playbook.decision;
  const audiences = seo.playbook.audiences;
  const relatedLinks = relatedComparisons.slice(0, 6).map(tool => ({
    href: getComparisonPath(toolA, tool),
    label: `${toolA.name} vs ${tool.name}`,
  }));
  const intro = variant([
    `${toolA.name} et ${toolB.name} peuvent sembler proches, mais le bon choix depend du contexte. Ce comparatif se concentre sur les criteres qui changent vraiment une decision : usage, prix, limites, support et deploiement.`,
    `Comparer ${toolA.name} et ${toolB.name} uniquement sur la notoriete serait trop court. Nous analysons les scenarios ou chaque outil prend l'avantage, puis les points a verifier avant de s'engager.`,
    `Ce duel ${category} met face a face deux solutions utiles mais pas interchangeables. L'objectif est de savoir quand choisir ${toolA.name}, quand preferer ${toolB.name}, et quand tester une autre piste.`,
  ], seo.seed, 3);
  const rows = [
    ['Categorie', category, category],
    ['Prix', toolA.price || 'A verifier', toolB.price || 'A verifier'],
    ['Essai gratuit', toolA.trial ? 'Oui' : 'Non / a verifier', toolB.trial ? 'Oui' : 'Non / a verifier'],
    ['Note editoriale', scoreLabel(toolA, 'Non note'), scoreLabel(toolB, 'Non note')],
    ['Point fort', cleanText(toolA.strengthShort?.[0] || toolA.highlight), cleanText(toolB.strengthShort?.[0] || toolB.highlight)],
    ['Limite a verifier', cleanText(toolA.limitations?.[0] || 'Verifier le plan adapte'), cleanText(toolB.limitations?.[0] || 'Verifier le plan adapte')],
    ['Profil naturel', audiences[0], audiences[1] || audiences[0]],
  ];

  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Comparatifs', url: '/comparatifs' },
      { name: seo.title },
    ]),
    buildProductSchema(toolA),
    buildProductSchema(toolB),
    buildItemListFromLinks(`Maillage ${toolA.name} vs ${toolB.name}`, [
      { name: `Fiche ${toolA.name}`, url: getToolPath(toolA) },
      { name: `Fiche ${toolB.name}`, url: getToolPath(toolB) },
      { name: `Alternatives a ${toolA.name}`, url: getAlternativePath(toolA) },
      { name: `Alternatives a ${toolB.name}`, url: getAlternativePath(toolB) },
      ...relatedLinks.map(link => ({ name: link.label, url: link.href })),
    ]),
    buildHowToSchema({
      name: `Comment choisir entre ${toolA.name} et ${toolB.name}`,
      description: `Methode pour departager ${toolA.name} et ${toolB.name} selon des criteres mesurables.`,
      steps: [
        { name: 'Definir le profil', text: `Choisissez le scenario le plus proche : ${audiences.slice(0, 3).join(', ')}.` },
        { name: 'Comparer les criteres', text: `Controlez ${criteria.slice(0, 4).join(', ')} avant le prix final.` },
        { name: 'Tester sur un cas reel', text: 'Utilisez un projet limite pour mesurer la qualite, le support et la facilite de prise en main.' },
        { name: 'Verifier la sortie', text: 'Controlez les exports, la migration et les conditions contractuelles avant de vous engager.' },
      ],
    }),
    buildFaqSchema(faqs),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${seo.title} | Comparateur-Tech`}
        description={seo.description}
        canonical={`https://comparateur-tech.com${canonicalPath}`}
        structuredData={schemas}
      />
      <Header />
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <nav className="text-sm text-gray-500 mb-8" aria-label="Fil d Ariane">
          <Link href="/" className="hover:text-purple-700">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/comparatifs" className="hover:text-purple-700">Comparatifs</Link>
          <span className="mx-2">/</span>
          <span>{toolA.name} vs {toolB.name}</span>
        </nav>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-3">Comparatif {category}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">{seo.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#verdict" className="rounded-xl bg-purple-700 text-white px-4 py-3 text-sm font-bold hover:bg-purple-800">Aller au verdict</a>
            <Link href={categoryPath} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-purple-300">Voir {category}</Link>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="grid md:grid-cols-2 gap-4">
              {[toolA, toolB].map((tool, index) => (
                <article key={tool.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <p className="text-xs font-bold text-purple-700 mb-2">Quand choisir {tool.name}</p>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{audiences[index] || audiences[0]}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{summary(tool)}</p>
                  <Link href={getToolPath(tool)} className="text-sm font-semibold text-purple-700 hover:underline">Lire la fiche {tool.name}</Link>
                </article>
              ))}
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tableau comparatif detaille</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[780px] text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500">Critere</th>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Criteres qui font basculer le choix</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {criteria.map((criterion, index) => (
                  <div key={criterion} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{criterion}</h3>
                    <p className="text-sm text-gray-600">A verifier surtout pour {audiences[index % audiences.length]}.</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance, API, securite et support</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {toolA.name} se distingue par {cleanText(toolA.strengthShort?.slice(0, 2).join(', ') || toolA.highlight || 'son positionnement')}. {toolB.name} merite d'etre teste pour {cleanText(toolB.strengthShort?.slice(0, 2).join(', ') || toolB.highlight || 'son approche differente')}.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Avant de trancher, controlez les integrations, les exports, le support, la documentation API et les conditions de confidentialite. Ces details font souvent plus de difference que la note globale.
              </p>
            </section>

            <section id="verdict" className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verdict : lequel choisir ?</h2>
              <p className="text-gray-700 leading-relaxed font-medium">
                Choisissez {toolA.name} si ses forces correspondent a votre priorite immediate et si son cout reste coherent apres essai. Choisissez {toolB.name} si vous cherchez une approche plus adaptee a {audiences[1] || audiences[0]}, une limite differente ou un meilleur alignement avec vos integrations.
              </p>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Questions frequentes sur {toolA.name} vs {toolB.name}</h2>
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
                <Link href={getAlternativePath(toolA)} className="block text-gray-700 hover:text-purple-700">Alternatives a {toolA.name}</Link>
                <Link href={getAlternativePath(toolB)} className="block text-gray-700 hover:text-purple-700">Alternatives a {toolB.name}</Link>
                <Link href={categoryPath} className="block text-gray-700 hover:text-purple-700">Categorie {category}</Link>
              </div>
            </section>
            <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Comparatifs proches</h2>
              <div className="space-y-3 text-sm">
                {relatedLinks.map(link => (
                  <Link key={link.href} href={link.href} className="block text-gray-700 hover:text-purple-700">{link.label}</Link>
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
