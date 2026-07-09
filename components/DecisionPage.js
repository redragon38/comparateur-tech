import Link from 'next/link';
import { ArrowRight, Check, ExternalLink, Search, Scale, ShieldCheck, Star, Trophy } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import SEO, { buildArticleSchema, buildBreadcrumbSchema, buildFAQSchema, buildItemListSchema } from './SEO';
import { normalizeInternalHref } from '../lib/internal-links';
import { useLocale } from '../lib/i18n';

// Dictionnaire FR/EN du "chrome" des pages de décision (comparatifs, alternatives, guides).
const DP = {
  fr: {
    quickCompare: 'Comparatif rapide', criterion: 'Critère',
    rowCategory: 'Catégorie', rowPrice: 'Prix', rowTrial: 'Essai gratuit', rowRating: 'Note éditoriale', rowIdeal: 'Idéal pour',
    toVerify: 'À vérifier', yes: 'Oui', noVerify: 'Non / à vérifier', usageCompare: 'Usage à comparer',
    choiceByNeed: 'Quel choix selon votre besoin ?', alsoCompare: 'À comparer aussi',
    quickVerdict: 'Verdict rapide', startingPoint: 'Point de départ :', seeSheet: (n) => `voir la fiche ${n}`,
    selection: 'Sélection', toolsToCompare: 'Outils à comparer', seeMethod: 'Voir notre méthode',
    faqTitle: 'Questions fréquentes', compareTools: 'Comparer les outils', readVerdict: 'Lire le verdict',
    updatedOn: (d) => `Mis à jour le ${d}`,
    affiliate: 'Certains liens peuvent être affiliés, sans coût supplémentaire pour vous. Nos recommandations restent éditoriales.',
    editorialRating: 'Note éditoriale', price: 'Prix', seeProfile: 'Voir la fiche', seeOffer: "Voir l'offre", defaultCat: 'Outil tech',
    home: 'Accueil', bcComparison: 'Comparatif', bcAlternatives: 'Alternatives', bcGuide: 'Guide',
    introAlt: (n) => `Voici les alternatives à ${n} à comparer en priorité selon le prix, les limites, les fonctionnalités et votre usage.`,
    introFallback: 'Guide rapide pour comparer les options les plus pertinentes.',
    targetTool: 'cet outil',
    months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    faqCompChoose: (a, b) => `${a} ou ${b} : lequel choisir ?`,
    faqCriteria: 'Quels critères regarder avant de choisir ?',
    faqCriteriaA: (c) => `Les critères les plus utiles sont : ${c}. Le meilleur choix dépend surtout de votre usage réel et de votre budget.`,
    faqReplace: 'Cette comparaison remplace-t-elle un test complet ?',
    faqReplaceA: (a, b) => `Non. Elle sert à décider plus vite. Pour aller plus loin, consultez aussi les fiches détaillées de ${a} et ${b}.`,
    faqAltBest: (n) => `Quelle est la meilleure alternative à ${n} ?`,
    faqAltWhy: (n) => `Pourquoi chercher une alternative à ${n} ?`,
    faqAltWhyA: 'Une alternative peut être plus adaptée si vous cherchez un prix différent, une interface plus simple, des limites plus souples ou des fonctionnalités spécifiques.',
    faqAltPriority: 'Quelles alternatives comparer en priorité ?',
    faqAltPriorityA: (names) => `Commencez par comparer ${names}. Ces outils couvrent les besoins les plus fréquents de cette catégorie.`,
    faqBest: 'Quel est le meilleur choix pour ce besoin ?',
    faqImportant: 'Quels critères sont les plus importants ?',
    faqImportantA: (c) => `Regardez surtout : ${c}. Ces critères évitent de choisir uniquement selon la notoriété.`,
    faqTopRated: 'Faut-il choisir l’outil le mieux noté ?',
    faqTopRatedA: 'Pas forcément. La note éditoriale aide à trier, mais le bon outil dépend du prix, du niveau technique et de votre cas d’usage.',
  },
  en: {
    quickCompare: 'Quick comparison', criterion: 'Criterion',
    rowCategory: 'Category', rowPrice: 'Price', rowTrial: 'Free trial', rowRating: 'Editorial rating', rowIdeal: 'Ideal for',
    toVerify: 'To be checked', yes: 'Yes', noVerify: 'No / to be checked', usageCompare: 'Usage to compare',
    choiceByNeed: 'Which choice for your needs?', alsoCompare: 'Also worth comparing',
    quickVerdict: 'Quick verdict', startingPoint: 'Starting point:', seeSheet: (n) => `see the ${n} review`,
    selection: 'Selection', toolsToCompare: 'Tools to compare', seeMethod: 'See our method',
    faqTitle: 'Frequently asked questions', compareTools: 'Compare the tools', readVerdict: 'Read the verdict',
    updatedOn: (d) => `Updated on ${d}`,
    affiliate: 'Some links may be affiliated, at no extra cost to you. Our recommendations stay editorial.',
    editorialRating: 'Editorial rating', price: 'Price', seeProfile: 'View details', seeOffer: 'View the offer', defaultCat: 'Tech tool',
    home: 'Home', bcComparison: 'Comparison', bcAlternatives: 'Alternatives', bcGuide: 'Guide',
    introAlt: (n) => `Here are the alternatives to ${n} to compare first, based on price, limitations, features and your use case.`,
    introFallback: 'Quick guide to compare the most relevant options.',
    targetTool: 'this tool',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    faqCompChoose: (a, b) => `${a} or ${b}: which one to choose?`,
    faqCriteria: 'Which criteria should you look at before choosing?',
    faqCriteriaA: (c) => `The most useful criteria are: ${c}. The best choice mainly depends on your real usage and your budget.`,
    faqReplace: 'Does this comparison replace a full test?',
    faqReplaceA: (a, b) => `No. It helps you decide faster. To go further, also check the detailed reviews of ${a} and ${b}.`,
    faqAltBest: (n) => `What is the best alternative to ${n}?`,
    faqAltWhy: (n) => `Why look for an alternative to ${n}?`,
    faqAltWhyA: 'An alternative may fit better if you are looking for a different price, a simpler interface, more flexible limits or specific features.',
    faqAltPriority: 'Which alternatives should you compare first?',
    faqAltPriorityA: (names) => `Start by comparing ${names}. These tools cover the most common needs in this category.`,
    faqBest: 'What is the best choice for this need?',
    faqImportant: 'Which criteria matter most?',
    faqImportantA: (c) => `Focus mainly on: ${c}. These criteria keep you from choosing on reputation alone.`,
    faqTopRated: 'Should you pick the highest-rated tool?',
    faqTopRatedA: 'Not necessarily. The editorial rating helps you sort, but the right tool depends on price, technical level and your use case.',
  },
};

function Stars({ value }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.floor(value || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

function clean(text) {
  return String(text || '').replace(/__([^_]+)__/g, '$1').replace(/\s+/g, ' ').trim();
}

function categoryLabel(tool, t) {
  return tool?.categories?.[0] || t.defaultCat;
}

function ToolMiniCard({ tool, index, t }) {
  const url = tool.affiliateUrl || tool.website || `/tool/${tool.id}`;
  return (
    <article className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-purple-300 hover:shadow-lg transition-all flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {tool.logo ? (
            <img src={tool.logo} alt={tool.name} width={48} height={48} loading="lazy" decoding="async" className="w-full h-full object-contain p-2" />
          ) : (
            <span className="text-2xl">🛠️</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">#{index + 1}</span>
            <span className="text-xs text-gray-400">{categoryLabel(tool, t)}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mt-1">{tool.name}</h2>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed flex-1">{clean(tool.short || tool.highlight)}</p>

      <div className="grid grid-cols-2 gap-3 my-5 text-xs">
        {tool.rating && (
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p className="text-gray-400 mb-1">{t.editorialRating}</p>
            <div className="flex items-center gap-2"><Stars value={tool.rating.value} /><span className="font-bold text-gray-800">{tool.rating.value}/5</span></div>
          </div>
        )}
        {tool.price && (
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p className="text-gray-400 mb-1">{t.price}</p>
            <p className="font-bold text-gray-800">{tool.price}</p>
          </div>
        )}
      </div>

      {(tool.strengthShort || tool.strengths || []).length > 0 && (
        <ul className="space-y-2 mb-5">
          {(tool.strengthShort || tool.strengths || []).slice(0, 3).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{clean(item)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 mt-auto">
        <Link href={`/tool/${tool.id}`} className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-700 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-colors">
          {t.seeProfile} <ArrowRight className="w-4 h-4" />
        </Link>
        <a href={url} target="_blank" rel="sponsored nofollow noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl gradient-purple px-3 py-3 text-sm font-bold text-white hover:shadow-md transition-all">
          {t.seeOffer} <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}

function ComparisonTable({ tools, criteria, t }) {
  if (tools.length < 2) return null;
  const rows = [
    { label: t.rowCategory, values: tools.map(tool => (tool.categories || []).join(', ') || ', ') },
    { label: t.rowPrice, values: tools.map(tool => tool.price || t.toVerify) },
    { label: t.rowTrial, values: tools.map(tool => tool.trial ? t.yes : t.noVerify) },
    { label: t.rowRating, values: tools.map(tool => tool.rating ? `${tool.rating.value}/5` : ', ') },
    { label: t.rowIdeal, values: tools.map(tool => tool.idealFor?.[0] || tool.strengthShort?.[0] || t.usageCompare) },
  ];

  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Scale className="w-5 h-5 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">{t.quickCompare}</h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-gray-500 font-semibold">{t.criterion}</th>
              {tools.map(tool => <th key={tool.id} className="text-left px-4 py-3 text-gray-900 font-bold">{tool.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label} className="border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3 text-gray-500 font-semibold">{row.label}</td>
                {row.values.map((value, i) => <td key={i} className="px-4 py-3 text-gray-700">{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {criteria?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {criteria.map(item => <span key={item} className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full">{item}</span>)}
        </div>
      )}
    </section>
  );
}

function DecisionBlocks({ config, t }) {
  if (!config.bestFor?.length) return null;
  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">{t.choiceByNeed}</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {config.bestFor.map(item => (
          <div key={item.label} className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
            <p className="text-lg font-bold text-gray-900">{item.winner}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedLinks({ links, t }) {
  if (!links?.length) return null;
  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">{t.alsoCompare}</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {links.map(link => (
          <Link key={link.href} href={normalizeInternalHref(link.href)} className="rounded-2xl bg-purple-50 border border-purple-200 p-4 text-purple-800 font-semibold hover:bg-purple-100 transition-colors flex items-center justify-between gap-3">
            <span>{link.label}</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatDate(isoDate, t) {
  if (!/^\d{4}-\d{2}-\d{2}/.test(String(isoDate || ''))) return null;
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  // FR: "12 mars 2026" ; EN: "March 12, 2026"
  return t === undefined || t.months[0] === 'janvier'
    ? `${d} ${t.months[m - 1]} ${y}`
    : `${t.months[m - 1]} ${d}, ${y}`;
}

function ContentSections({ sections }) {
  if (!sections?.length) return null;
  return (
    <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-7">
      {sections.map(section => (
        <div key={section.title}>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
          {String(section.text).split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-3 last:mb-0">{paragraph}</p>
          ))}
        </div>
      ))}
    </section>
  );
}

function buildFaq(config, tools, targetTool, t) {
  const names = tools.map(tool => tool.name).join(', ');
  const criteria = (config.criteria || []).join(', ');
  const targetName = targetTool?.name || t.targetTool;
  if (config.type === 'comparison' && tools.length >= 2) {
    return [
      { q: t.faqCompChoose(tools[0].name, tools[1].name), a: config.verdict },
      { q: t.faqCriteria, a: t.faqCriteriaA(criteria) },
      { q: t.faqReplace, a: t.faqReplaceA(tools[0].name, tools[1].name) },
    ];
  }
  if (config.type === 'alternatives') {
    return [
      { q: t.faqAltBest(targetName), a: config.verdict },
      { q: t.faqAltWhy(targetName), a: t.faqAltWhyA },
      { q: t.faqAltPriority, a: t.faqAltPriorityA(names) },
    ];
  }
  return [
    { q: t.faqBest, a: config.verdict },
    { q: t.faqImportant, a: t.faqImportantA(criteria) },
    { q: t.faqTopRated, a: t.faqTopRatedA },
  ];
}

export default function DecisionPage({ slug, config, targetTool, tools }) {
  const locale = useLocale();
  const t = DP[locale] || DP.fr;
  const canonicalPath = config.canonicalPath || `/${slug}`;
  const canonical = `https://comparateur-tech.com${canonicalPath}`;
  const generatedFaqs = buildFaq(config, tools, targetTool, t);
  // FAQ éditoriale de la config en premier, complétée par les questions générées (sans doublon).
  const customQuestions = new Set((config.faq || []).map(item => item.q));
  const faqs = [...(config.faq || []), ...generatedFaqs.filter(item => !customQuestions.has(item.q))];
  const updatedLabel = formatDate(config.lastmod, t);
  const breadcrumbName = config.type === 'comparison' ? t.bcComparison : config.type === 'alternatives' ? t.bcAlternatives : t.bcGuide;
  const structuredData = [
    buildBreadcrumbSchema([
      { name: t.home, url: '/' },
      { name: breadcrumbName, url: config.type === 'comparison' ? '/comparatifs' : config.type === 'alternatives' ? '/alternatives' : '/guides' },
      { name: config.title },
    ]),
    buildItemListSchema({ name: config.title, description: config.description, items: tools }),
    buildFAQSchema(faqs),
    ...(config.lastmod ? [buildArticleSchema({
      title: config.metaTitle || config.title,
      description: config.description,
      url: canonicalPath,
      datePublished: config.published || config.lastmod,
      dateModified: config.lastmod,
      section: config.eyebrow,
    })] : []),
  ].filter(Boolean);

  const heroIcon = config.type === 'comparison' ? <Scale className="w-4 h-4" /> : config.type === 'alternatives' ? <Search className="w-4 h-4" /> : <Trophy className="w-4 h-4" />;
  const intro = config.intro || (config.type === 'alternatives' && targetTool ? t.introAlt(targetTool.name) : t.introFallback);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={config.metaTitle || config.title}
        description={config.description}
        canonical={canonical}
        structuredData={structuredData}
        ogType={config.lastmod ? 'article' : 'website'}
        datePublished={config.published || config.lastmod || null}
        dateModified={config.lastmod || null}
        articleSection={config.lastmod ? config.eyebrow : null}
      />
      <Header />
      <main>
        <section className="bg-gradient-to-b from-purple-50 to-white border-b border-purple-100 py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
              {heroIcon} {config.eyebrow}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">{config.title}</h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">{intro}</p>
            {updatedLabel && (
              <p className="text-sm text-gray-400 mt-4">{t.updatedOn(updatedLabel)}</p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#classement" className="gradient-purple text-white px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 shadow-md shadow-purple-300/40">
                {t.compareTools} <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#verdict" className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:border-purple-300 hover:text-purple-700 transition-colors">
                {t.readVerdict}
              </a>
            </div>
            <div className="mt-6 inline-flex items-start gap-2 rounded-2xl border border-purple-200 bg-white px-4 py-3 text-left text-sm text-gray-600 shadow-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
              <span>{t.affiliate}</span>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14 max-w-6xl space-y-8">
          <section id="verdict" className="bg-white border border-purple-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1.5 gradient-purple" aria-hidden="true" />
            <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-3">{t.quickVerdict}</p>
            <p className="text-gray-800 text-lg leading-relaxed font-medium">{config.verdict}</p>
            {targetTool && (
              <p className="text-sm text-gray-500 mt-4">{t.startingPoint} <Link href={`/tool/${targetTool.id}`} className="text-purple-700 font-semibold hover:underline">{t.seeSheet(targetTool.name)}</Link>.</p>
            )}
          </section>

          {config.type === 'comparison' && <ComparisonTable tools={tools} criteria={config.criteria} t={t} />}
          <DecisionBlocks config={config} t={t} />
          <ContentSections sections={config.sections} />

          <section id="classement" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-purple-700 mb-2">{t.selection}</p>
                <h2 className="text-3xl font-bold text-gray-900">{t.toolsToCompare}</h2>
              </div>
              <Link href="/methodologie" className="text-sm font-semibold text-purple-700 hover:underline">{t.seeMethod}</Link>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {tools.map((tool, index) => <ToolMiniCard key={tool.id} tool={tool} index={index} t={t} />)}
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">{t.faqTitle}</h2>
            <div className="space-y-3">
              {faqs.map(item => (
                <div key={item.q} className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <RelatedLinks links={config.relatedLinks} t={t} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
