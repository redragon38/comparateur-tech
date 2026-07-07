import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ToolCard from '../../../components/ToolCard';
import SEO, { buildBreadcrumbSchema, buildFAQSchema, buildItemListSchema } from '../../../components/SEO';
import { IA_SUBCATEGORIES, localizeSubcat } from '../../../lib/ia-subcategories';
import { localizePaths, useT, useLocale } from '../../../lib/i18n';

export async function getStaticPaths() {
  const paths = IA_SUBCATEGORIES.map(sub => ({
    params: { subcategory: sub.slug },
  }));
  return { paths: localizePaths(paths), fallback: false };
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
  fr: {
    redaction: ['Qualité du style en français', 'Longueur du contexte', 'Fiabilité des réponses', 'Export et intégrations'],
    image: ['Qualité visuelle', 'Contrôle du style', 'Droits d’usage', 'Coût par génération'],
    video: ['Qualité du mouvement', 'Durée des rendus', 'Contrôle caméra', 'Export professionnel'],
    audio: ['Naturel de la voix', 'Langues disponibles', 'Droits commerciaux', 'Temps de génération'],
    recherche: ['Sources citées', 'Fraîcheur des réponses', 'Synthèse', 'Export des recherches'],
    code: ['Qualité des suggestions', 'Confidentialité du code', 'IDE compatibles', 'Compréhension du contexte'],
    agent: ['Autonomie réelle', 'Connecteurs disponibles', 'Contrôle humain', 'Journalisation des actions'],
    productivite: ['Collaboration', 'Automatisations', 'Gestion des tâches', 'Rapports et tableaux de bord'],
    default: ['Qualité des résultats', 'Prix', 'Confidentialité', 'Intégrations'],
  },
  en: {
    redaction: ['Writing style quality', 'Context length', 'Answer reliability', 'Export and integrations'],
    image: ['Visual quality', 'Style control', 'Usage rights', 'Cost per generation'],
    video: ['Motion quality', 'Render length', 'Camera control', 'Professional export'],
    audio: ['Voice naturalness', 'Available languages', 'Commercial rights', 'Generation time'],
    recherche: ['Cited sources', 'Answer freshness', 'Synthesis', 'Research export'],
    code: ['Suggestion quality', 'Code privacy', 'Compatible IDEs', 'Context understanding'],
    agent: ['Real autonomy', 'Available connectors', 'Human control', 'Action logging'],
    productivite: ['Collaboration', 'Automations', 'Task management', 'Reports and dashboards'],
    default: ['Output quality', 'Price', 'Privacy', 'Integrations'],
  },
};

const UI_TEXT = {
  fr: {
    home: 'Accueil', tools: 'Outils', ai: 'Intelligence artificielle',
    seoTitle: (label) => `${label} – Comparatif & Avis 2026 | Comparateur-Tech`,
    seoDescription: (label, desc, n) => `Comparez les meilleurs outils de ${label.toLowerCase()} : ${desc} ${n} outil${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''} par nos experts.`,
    itemListName: (label) => `Comparatif ${label}`,
    toolsAvailable: (n) => `${n} outil${n > 1 ? 's' : ''} disponible${n > 1 ? 's' : ''}`,
    aiTypes: "Types d'IA", allTypes: 'Tous les types', otherCategories: 'Autres catégories',
    howToChoose: (label) => `Comment choisir une solution ${label.toLowerCase()} ?`,
    howToChooseIntro: "Testez toujours l'outil sur un exemple réel avant de comparer les prix. Les solutions IA peuvent sembler proches, mais elles diffèrent beaucoup sur la qualité, les limites d'usage et le contrôle du résultat.",
    noTools: "Aucun outil dans cette catégorie pour l'instant.",
    faqTitle: 'Questions fréquentes', otherAiTypes: "Autres types d'IA",
    toolCount: (n) => `${n} outil${n > 1 ? 's' : ''}`,
    otherCats: [
      { slug: 'hebergement-web', label: 'Hébergement web', icon: '🌐' },
      { slug: 'vpn', label: 'VPN', icon: '🛡️' },
      { slug: 'antivirus', label: 'Antivirus', icon: '🦠' },
      { slug: 'cybersecurite', label: 'Cybersécurité', icon: '🔐' },
    ],
    faq: (label, tools) => {
      const topTools = tools.slice(0, 3).map(t => t.name).join(', ');
      const l = label.toLowerCase();
      return [
        { q: `Comment choisir un outil ${l} ?`, a: `Comparez d'abord la qualité des résultats sur vos propres exemples, puis les limites du plan, la confidentialité des données et les intégrations avec vos outils existants.` },
        { q: `Combien d'outils sont listés dans ${l} ?`, a: `Cette sélection présente ${tools.length} outil${tools.length > 1 ? 's' : ''} pour ${l}, avec accès aux fiches détaillées, prix, notes et alternatives.` },
        { q: `Quels outils comparer en priorité ?`, a: topTools ? `Vous pouvez commencer par ${topTools}, puis comparer selon votre budget, le niveau de contrôle attendu et la qualité obtenue sur vos cas d'usage.` : `Commencez par les outils qui documentent clairement leurs limites, leurs prix et leurs conditions d'utilisation des données.` },
      ];
    },
  },
  en: {
    home: 'Home', tools: 'Tools', ai: 'Artificial intelligence',
    seoTitle: (label) => `${label} – Comparison & Reviews 2026 | Comparateur-Tech`,
    seoDescription: (label, desc, n) => `Compare the best ${label.toLowerCase()} tools: ${desc} ${n} tool${n > 1 ? 's' : ''} selected by our experts.`,
    itemListName: (label) => `${label} comparison`,
    toolsAvailable: (n) => `${n} tool${n > 1 ? 's' : ''} available`,
    aiTypes: 'AI types', allTypes: 'All types', otherCategories: 'Other categories',
    howToChoose: (label) => `How to choose a ${label.toLowerCase()} solution?`,
    howToChooseIntro: 'Always test the tool on a real example before comparing prices. AI solutions may look similar, but they differ a lot in quality, usage limits and control over the output.',
    noTools: 'No tools in this category yet.',
    faqTitle: 'Frequently asked questions', otherAiTypes: 'Other AI types',
    toolCount: (n) => `${n} tool${n > 1 ? 's' : ''}`,
    otherCats: [
      { slug: 'hebergement-web', label: 'Web hosting', icon: '🌐' },
      { slug: 'vpn', label: 'VPN', icon: '🛡️' },
      { slug: 'antivirus', label: 'Antivirus', icon: '🦠' },
      { slug: 'cybersecurite', label: 'Cybersecurity', icon: '🔐' },
    ],
    faq: (label, tools) => {
      const topTools = tools.slice(0, 3).map(t => t.name).join(', ');
      const l = label.toLowerCase();
      return [
        { q: `How do I choose a ${l} tool?`, a: `First compare output quality on your own examples, then the plan limits, data privacy and integrations with your existing tools.` },
        { q: `How many tools are listed in ${l}?`, a: `This selection features ${tools.length} tool${tools.length > 1 ? 's' : ''} for ${l}, with access to detailed pages, pricing, ratings and alternatives.` },
        { q: `Which tools should I compare first?`, a: topTools ? `You can start with ${topTools}, then compare based on your budget, the level of control you need and the quality you get on your use cases.` : `Start with tools that clearly document their limits, pricing and data-usage terms.` },
      ];
    },
  },
};

function getSubcategoryCriteria(locale, slug) {
  const dict = IA_BUYER_CRITERIA[locale] || IA_BUYER_CRITERIA.fr;
  return dict[slug] || dict.default;
}

export default function IASubcategoryPage({ sub: rawSub, tools, otherSubs: rawOtherSubs }) {
  const t = useT(UI_TEXT);
  const locale = useLocale();
  const sub = localizeSubcat(rawSub, locale);
  const otherSubs = rawOtherSubs.map((s) => ({ ...localizeSubcat(s, locale), count: s.count }));
  const subcategories = IA_SUBCATEGORIES.map((s) => localizeSubcat(s, locale));
  const buyerCriteria = getSubcategoryCriteria(locale, sub.slug);
  const subcategoryFaq = t.faq(sub.label, tools);
  const structuredData = [
    buildBreadcrumbSchema([
      { name: t.home, url: '/' },
      { name: t.tools, url: '/outils' },
      { name: t.ai, url: '/outils/intelligence-artificielle' },
      { name: sub.label },
    ]),
    buildItemListSchema({
      name: t.itemListName(sub.label),
      description: sub.desc,
      items: tools,
    }),
    buildFAQSchema(subcategoryFaq),
  ];

  return (
    <>
      <SEO
        title={t.seoTitle(sub.label)}
        description={t.seoDescription(sub.label, sub.desc, tools.length)}
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
                <Link href="/" className="hover:text-gray-900 transition-colors">{t.home}</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/outils" className="hover:text-gray-900 transition-colors">{t.tools}</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/outils/intelligence-artificielle" className="hover:text-gray-900 transition-colors">{t.ai}</Link>
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
                    {t.toolsAvailable(tools.length)}
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
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{t.aiTypes}</h3>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/outils/intelligence-artificielle"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-purple-50 hover:text-purple-700 transition-all">
                        <span>🤖</span> {t.allTypes}
                      </Link>
                    </li>
                    {subcategories.map(s => {
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
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{t.otherCategories}</h3>
                    <ul className="space-y-1">
                      {t.otherCats.map(cat => (
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
                  <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">{t.howToChoose(sub.label)}</h2>
                  <p className="text-gray-600 leading-relaxed mb-5">
                    {t.howToChooseIntro}
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
                    <p className="text-gray-500 text-lg">{t.noTools}</p>
                  </div>
                )}

                <section className="mt-12 bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">{t.faqTitle}</h2>
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
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t.otherAiTypes}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {otherSubs.map(s => (
                        <Link key={s.slug} href={`/outils/intelligence-artificielle/${s.slug}`}
                          className={`bg-white rounded-2xl border-2 ${s.border} p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            {s.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">{s.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{t.toolCount(s.count)}</p>
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
