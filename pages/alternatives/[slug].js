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
import {
  buildAlternativeFaq,
  buildAlternativeSeoModel,
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
  return cleanText(tool.short || tool.highlight || `${tool.name} est une solution a comparer selon votre usage.`);
}

export default function AlternativePage({ tool, alternatives, category }) {
  const canonicalPath = getAlternativePath(tool);
  const categoryPath = getCategoryPath(category);
  const seo = buildAlternativeSeoModel(tool, alternatives, category);
  const faqs = buildAlternativeFaq(tool, alternatives, category);
  const topAlternatives = alternatives.slice(0, 6);
  const criteria = seo.playbook.decision;
  const audiences = seo.playbook.audiences;
  const comparisonLinks = topAlternatives.slice(0, 4).map(item => ({
    href: getComparisonPath(tool, item),
    label: `${tool.name} vs ${item.name}`,
  }));
  const intro = variant([
    `${tool.name} peut rester un tres bon choix, mais une page d'alternatives utile doit montrer les compromis. Nous comparons ici les options proches selon les usages, les limites, le prix et la facilite de migration.`,
    `Changer de ${tool.name} n'a de sens que si l'alternative resout un probleme precis. Ce guide classe les solutions voisines et distingue les cas ou il vaut mieux rester de ceux ou il faut tester autre chose.`,
    `Le meilleur remplacement de ${tool.name} depend rarement d'un seul critere. La comparaison ci-dessous croise prix, fonctionnalites, support, contraintes techniques et profils utilisateurs.`,
  ], seo.seed, 3);

  const schemas = [
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Alternatives', url: '/alternatives' },
      { name: seo.title },
    ]),
    buildItemListSchema(seo.title, seo.description, alternatives),
    buildItemListFromLinks(`Comparatifs autour de ${tool.name}`, comparisonLinks.map(link => ({ name: link.label, url: link.href }))),
    buildProductSchema(tool),
    buildHowToSchema({
      name: `Comment choisir une alternative a ${tool.name}`,
      description: `Methode editoriale pour comparer ${tool.name} avec des solutions proches sans se limiter au prix.`,
      steps: [
        { name: 'Lister les irritants', text: `Identifiez ce qui bloque vraiment avec ${tool.name} : prix, limites, support, securite ou integrations.` },
        { name: 'Tester deux outils', text: 'Selectionnez deux alternatives proches et testez-les sur un cas d usage reel.' },
        { name: 'Comparer le cout complet', text: 'Integrez renouvellement, options payantes, temps de migration et support.' },
        { name: 'Migrer progressivement', text: 'Gardez une periode de coexistence avant de supprimer vos donnees ou automatisations existantes.' },
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
          <Link href="/alternatives" className="hover:text-purple-700">Alternatives</Link>
          <span className="mx-2">/</span>
          <span>{tool.name}</span>
        </nav>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-3">Alternatives {category}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">{seo.title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#classement" className="rounded-xl bg-purple-700 text-white px-4 py-3 text-sm font-bold hover:bg-purple-800">{seo.cta}</a>
            <Link href={getToolPath(tool)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-purple-300">Voir la fiche {tool.name}</Link>
            <Link href={categoryPath} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:border-purple-300">Explorer {category}</Link>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Pourquoi changer de {tool.name} ?</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Changez si votre besoin principal concerne {criteria.slice(0, 3).join(', ')}, ou si le cout total devient difficile a justifier face a des outils plus specialises.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Quand rester sur {tool.name} ?</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Restez si vos workflows sont deja stables, si les limites actuelles sont acceptables et si l'equipe maitrise mieux {tool.name} que ses concurrents directs.
                </p>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tableau de decision</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[820px] text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500">Outil</th>
                      <th className="text-left px-4 py-3 text-gray-500">Prix</th>
                      <th className="text-left px-4 py-3 text-gray-500">Note</th>
                      <th className="text-left px-4 py-3 text-gray-500">Profil prioritaire</th>
                      <th className="text-left px-4 py-3 text-gray-500">A retenir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[tool, ...topAlternatives].map((item, index) => (
                      <tr key={item.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-bold text-gray-900"><Link href={getToolPath(item)} className="hover:text-purple-700">{item.name}</Link></td>
                        <td className="px-4 py-3 text-gray-600">{item.price || 'A verifier'}</td>
                        <td className="px-4 py-3 text-gray-600">{item.rating?.value ? `${item.rating.value}/5` : 'Non note'}</td>
                        <td className="px-4 py-3 text-gray-600">{audiences[index % audiences.length]}</td>
                        <td className="px-4 py-3 text-gray-600">{cleanText(item.strengthShort?.[0] || item.highlight || item.short)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="classement" className="space-y-4 scroll-mt-24">
              <h2 className="text-2xl font-bold text-gray-900">Classement des alternatives pertinentes a {tool.name}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {topAlternatives.map((item, index) => (
                  <article key={item.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-xs font-bold text-purple-700 mb-2">#{index + 1} pour {audiences[index % audiences.length]}</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Criteres a verifier avant de remplacer {tool.name}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{short(tool)}</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {criteria.map(criterion => (
                  <li key={criterion} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">{criterion}</li>
                ))}
              </ul>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan de migration sans risque</h2>
              <ol className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <li><strong>1.</strong> Exporter les donnees et noter les integrations utilisees avec {tool.name}.</li>
                <li><strong>2.</strong> Tester deux alternatives sur un projet limite et mesurable.</li>
                <li><strong>3.</strong> Comparer les couts apres promotion, les limites et le support.</li>
                <li><strong>4.</strong> Basculer progressivement les workflows les moins critiques.</li>
              </ol>
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Questions frequentes sur {tool.name} et ses alternatives</h2>
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
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Maillage utile</h2>
              <div className="space-y-3 text-sm">
                <Link href={getToolPath(tool)} className="block font-semibold text-purple-700 hover:underline">Fiche {tool.name}</Link>
                <Link href={categoryPath} className="block font-semibold text-purple-700 hover:underline">Categorie {category}</Link>
                {comparisonLinks.map(link => <Link key={link.href} href={link.href} className="block text-gray-700 hover:text-purple-700">{link.label}</Link>)}
              </div>
            </section>
            <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Pages proches</h2>
              <div className="space-y-3 text-sm">
                {topAlternatives.slice(0, 5).map(item => (
                  <Link key={item.id} href={getAlternativePath(item)} className="block text-gray-700 hover:text-purple-700">Alternatives a {item.name}</Link>
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
