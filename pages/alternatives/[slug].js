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
  getRelatedTools,
  getToolBySlug,
  getToolPath,
  isAlternativePageIndexable,
  primaryCategory,
} from '../../lib/programmatic-seo';

function readTools() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools-slim.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export async function getServerSideProps({ params, res }) {
  const tools = readTools();
  const tool = getToolBySlug(tools, params.slug);

  if (!tool || !isAlternativePageIndexable(tools, tool)) {
    return { notFound: true };
  }

  const alternatives = getRelatedTools(tools, tool, 8);
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');

  return {
    props: {
      tool,
      alternatives,
      category: primaryCategory(tool),
    },
  };
}

function short(tool) {
  return cleanText(tool.short || tool.highlight || `${tool.name} est une solution à comparer selon votre usage.`);
}

function buildFaq(tool, alternatives) {
  const names = alternatives.slice(0, 3).map(item => item.name).join(', ');
  return [
    {
      q: `Quelle est la meilleure alternative à ${tool.name} ?`,
      a: `${names || 'Les outils proches de la même catégorie'} sont les premières options à comparer avec ${tool.name}. Le bon choix dépend surtout du prix, des limites, du niveau de support et du cas d’usage.`,
    },
    {
      q: `Pourquoi chercher une alternative à ${tool.name} ?`,
      a: `Une alternative peut être plus pertinente si ${tool.name} ne couvre pas votre budget, vos contraintes techniques, vos besoins d’intégration ou votre niveau attendu de simplicité.`,
    },
    {
      q: `Comment comparer ${tool.name} avec ses concurrents ?`,
      a: `Regardez la catégorie, le prix, l’essai gratuit, la note éditoriale, les points forts et les limites. Il faut aussi consulter les fiches détaillées des outils retenus.`,
    },
  ];
}

export default function AlternativePage({ tool, alternatives, category }) {
  const canonicalPath = getAlternativePath(tool);
  const categoryPath = getCategoryPath(category);
  const faqs = buildFaq(tool, alternatives);
  const topAlternatives = alternatives.slice(0, 6);
  const comparisonLinks = topAlternatives.slice(0, 4).map(item => ({
    href: getComparisonPath(tool, item),
    label: `${tool.name} vs ${item.name}`,
  }));

  const title = `Meilleures alternatives à ${tool.name}`;
  const description = `Comparez les meilleures alternatives à ${tool.name} : prix, points forts, limites, cas d’usage et outils similaires dans la catégorie ${category}.`;
  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Alternatives', url: '/alternatives' },
      { name: title },
    ]),
    buildItemListSchema(title, description, alternatives),
    buildFaqSchema(faqs),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${title} en 2026 | Comparateur-Tech`}
        description={description}
        canonical={`https://comparateur-tech.com${canonicalPath}`}
        structuredData={schemas}
      />
      <Header />
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-purple-700">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/alternatives" className="hover:text-purple-700">Alternatives</Link>
          <span className="mx-2">/</span>
          <span>{tool.name}</span>
        </nav>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-3">Alternatives</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">{title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            {tool.name} est une option connue en {category}, mais ce n’est pas forcément le meilleur choix pour tous les profils. Cette page compare les alternatives les plus proches pour décider selon le prix, les limites, les fonctionnalités et le niveau de simplicité attendu.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={getToolPath(tool)} className="rounded-xl bg-purple-700 text-white px-4 py-3 text-sm font-bold hover:bg-purple-800">Voir la fiche {tool.name}</Link>
            <Link href={categoryPath} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-purple-300">Voir la catégorie {category}</Link>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Comparaison rapide</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500">Outil</th>
                      <th className="text-left px-4 py-3 text-gray-500">Prix</th>
                      <th className="text-left px-4 py-3 text-gray-500">Note</th>
                      <th className="text-left px-4 py-3 text-gray-500">À retenir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[tool, ...topAlternatives].map(item => (
                      <tr key={item.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-bold text-gray-900"><Link href={getToolPath(item)} className="hover:text-purple-700">{item.name}</Link></td>
                        <td className="px-4 py-3 text-gray-600">{item.price || 'À vérifier'}</td>
                        <td className="px-4 py-3 text-gray-600">{item.rating?.value ? `${item.rating.value}/5` : 'Non noté'}</td>
                        <td className="px-4 py-3 text-gray-600">{cleanText(item.strengthShort?.[0] || item.highlight || item.short)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Alternatives pertinentes à {tool.name}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {topAlternatives.map(item => (
                  <article key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{short(item)}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link href={getToolPath(item)} className="text-sm font-semibold text-purple-700 hover:underline">Fiche {item.name}</Link>
                      <Link href={getComparisonPath(tool, item)} className="text-sm font-semibold text-gray-700 hover:text-purple-700">Comparer avec {tool.name}</Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Avantages et limites de {tool.name}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{short(tool)}</p>
              <p className="text-gray-600 leading-relaxed">
                {tool.name} reste à considérer si ses points forts correspondent à votre besoin principal. En revanche, une alternative peut être préférable si vous cherchez un tarif différent, une prise en main plus simple, de meilleures intégrations ou une approche plus spécialisée.
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
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Liens internes</h2>
              <div className="space-y-3 text-sm">
                <Link href={getToolPath(tool)} className="block font-semibold text-purple-700 hover:underline">Fiche {tool.name}</Link>
                <Link href={categoryPath} className="block font-semibold text-purple-700 hover:underline">Catégorie {category}</Link>
                {comparisonLinks.map(link => <Link key={link.href} href={link.href} className="block text-gray-700 hover:text-purple-700">{link.label}</Link>)}
              </div>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
