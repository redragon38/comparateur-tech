import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ExternalLink, Star, Check, X, ChevronDown, ChevronRight, Zap, Shield, Globe, Award, Scale, Plus } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO, { buildBreadcrumbSchema, buildFAQSchema, buildSoftwareSchema } from '../../components/SEO';
import { normalizeInternalHref } from '../../lib/internal-links';

// ─── AJOUT SSG : getStaticPaths + getStaticProps ──────────────────────────────
// AVANT : page 100% client-side (useEffect + fetch) → Google voyait une page vide
// APRÈS : rendu statique au build → tout le contenu est dans le HTML livré à Google

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return {
    paths: tools.map(t => ({ params: { id: t.id } })),
    fallback: false, // 404 pour les IDs inconnus
  };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'tools.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const tool = tools.find(t => t.id === params.id) || null;
  if (!tool) return { notFound: true };
  const relatedTools = tools
    .filter(t => t.id !== tool.id && t.categories?.some(c => tool.categories?.includes(c)))
    .slice(0, 6)
    .map(pickRelatedToolFields);
  return { props: { tool, relatedTools } };
}

// ─── Fin SSG ──────────────────────────────────────────────────────────────────

const CAT_META = {
  'VPN':                       { icon: '🛡️', gradient: 'from-blue-500 to-cyan-400',    accent: '#3b82f6', softBg: '#eff6ff', softText: '#1d4ed8', glow: 'rgba(59,130,246,0.18)',  border: '59,130,246'  },
  'Intelligence artificielle': { icon: '🤖', gradient: 'from-violet-500 to-purple-400', accent: '#7c3aed', softBg: '#f5f3ff', softText: '#5b21b6', glow: 'rgba(139,92,246,0.18)', border: '139,92,246' },
  'Hébergement web':           { icon: '🌐', gradient: 'from-emerald-500 to-teal-400',  accent: '#059669', softBg: '#ecfdf5', softText: '#065f46', glow: 'rgba(16,185,129,0.18)', border: '16,185,129' },
  'Antivirus':                 { icon: '🦠', gradient: 'from-rose-500 to-orange-400',   accent: '#dc2626', softBg: '#fff1f2', softText: '#9f1239', glow: 'rgba(239,68,68,0.18)',  border: '239,68,68'  },
  'Cybersécurité':             { icon: '🔐', gradient: 'from-slate-600 to-gray-800',    accent: '#334155', softBg: '#f8fafc', softText: '#334155', glow: 'rgba(51,65,85,0.18)',   border: '51,65,85'   },
  'IA générative':             { icon: '✨', gradient: 'from-pink-500 to-violet-400',   accent: '#db2777', softBg: '#fdf2f8', softText: '#9d174d', glow: 'rgba(236,72,153,0.18)', border: '236,72,153' },
};
const DEFAULT = { icon: '🛠️', gradient: 'from-purple-500 to-violet-400', accent: '#7c3aed', softBg: '#f5f3ff', softText: '#5b21b6', glow: 'rgba(139,92,246,0.18)', border: '139,92,246' };

function Stars({ val, size = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-${size} h-${size} ${i < Math.floor(val || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-100'}`} />
      ))}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-200"
      style={{ background: open ? '#fafafa' : 'white' }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-semibold text-gray-800 text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCategoryUrl(category) {
  if (!category) return '/outils';
  if (category === 'IA générative') return '/ia-generative';
  return `/outils/${slugify(category)}`;
}

function compactSerializableFields(fields) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  );
}

function pickRelatedToolFields(tool) {
  return compactSerializableFields({
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    logo: tool.logo,
    website: tool.website,
    affiliateUrl: tool.affiliateUrl,
    link: tool.link,
    categories: tool.categories || [],
    price: tool.price,
    trial: tool.trial,
    featured: tool.featured,
    verified: tool.verified,
    rating: tool.rating,
    short: tool.short,
    highlight: tool.highlight,
    strengthShort: tool.strengthShort || [],
    strengths: tool.strengths || [],
    languages: tool.languages || [],
    idealFor: tool.idealFor || [],
  });
}

function trimMetaText(text, maxLength) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const shortened = clean.slice(0, maxLength - 1).replace(/\s+\S*$/, '').trim();
  return `${shortened}…`;
}

function buildToolMetaTitle(tool) {
  return trimMetaText(tool.seoTitle || `${tool.name} : avis, prix et alternatives`, 62);
}

function buildToolMetaDescription(tool) {
  const fallback = tool.short
    ? `${tool.short} Avis, prix, points forts et alternatives.`
    : `Découvrez notre avis sur ${tool.name} : fonctionnalités, prix, points forts et alternatives.`;
  return trimMetaText(tool.metaDescription || fallback, 158);
}

// ─── Props injectées par getStaticProps (plus de useEffect / fetch) ───────────
export default function ToolPage({ tool, relatedTools }) {
  const cat = tool.categories?.[0];
  const m = CAT_META[cat] || DEFAULT;
  const url = tool.affiliateUrl || tool.website || '#';
  const [compareId, setCompareId] = useState(relatedTools?.[0]?.id || null);

  const compareTool = useMemo(() => {
    if (!compareId) return null;
    return (relatedTools || []).find(t => t.id === compareId) || null;
  }, [compareId, relatedTools]);

  const notForList = tool.notFor || tool.notIdealFor || [];
  const alternatives = Array.isArray(tool.alternatives) ? tool.alternatives : [];
  const categoryUrl = getCategoryUrl(cat);

  const comparisonRows = compareTool ? [
    { label: 'Catégorie', left: (tool.categories || []).join(', ') || '—', right: (compareTool.categories || []).join(', ') || '—' },
    { label: 'Prix', left: tool.price || 'Non communiqué', right: compareTool.price || 'Non communiqué' },
    { label: 'Essai gratuit', left: tool.trial ? 'Oui' : 'Non', right: compareTool.trial ? 'Oui' : 'Non' },
    { label: 'Note', left: tool.rating ? `${tool.rating.value}/5` : '—', right: compareTool.rating ? `${compareTool.rating.value}/5` : '—' },
    { label: 'Langues', left: tool.languages?.length ? tool.languages.slice(0, 4).join(', ').toUpperCase() : '—', right: compareTool.languages?.length ? compareTool.languages.slice(0, 4).join(', ').toUpperCase() : '—' },
    { label: 'Idéal pour', left: tool.idealFor?.[0] || '—', right: compareTool.idealFor?.[0] || '—' },
  ] : [];

  // ── Schémas JSON-LD : SoftwareApplication + BreadcrumbList + FAQPage ──
  const schemas = [
    buildSoftwareSchema(tool),
    buildBreadcrumbSchema([
      { name: 'Accueil', url: '/' },
      { name: 'Outils', url: '/outils' },
      ...(cat ? [{ name: cat, url: categoryUrl }] : []),
      { name: tool.name },
    ]),
    ...(tool.faq?.length ? [buildFAQSchema(tool.faq)] : []),
  ].filter(Boolean);

  const metaTitle = buildToolMetaTitle(tool);
  const metaDescription = buildToolMetaDescription(tool);
  const heroTitle = tool.heroTitle || tool.name;
  const heroIntro = tool.heroIntro || tool.short || tool.highlight;
  const contentSections = Array.isArray(tool.contentSections) ? tool.contentSections : [];
  const pageLinks = [
    ...(tool.description ? [{ id: `a-propos-${slugify(tool.name)}`, label: `À propos de ${tool.name}` }] : []),
    ...contentSections.map(section => ({ id: slugify(section.title), label: section.title })),
    ...(alternatives.length ? [{ id: 'alternatives', label: 'Alternatives' }] : []),
    ...(tool.verdict ? [{ id: 'notre-verdict', label: 'Notre verdict' }] : []),
    ...(tool.faq?.length ? [{ id: 'questions-frequentes', label: 'Questions fréquentes' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={metaTitle}
        description={metaDescription}
        canonical={`https://comparateur-tech.com/tool/${tool.id}`}
        ogType="article"
        datePublished={tool.createdAt || '2025-01-01'}
        dateModified={tool.updatedAt || tool.createdAt || '2025-01-01'}
        articleSection={(tool.categories||[])[0] || 'Outils'}
        structuredData={schemas}
      />
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-white border-b border-gray-100">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 800px 500px at 70% -100px, ${m.glow}, transparent)` }} />
          <div className={`h-[3px] w-full bg-gradient-to-r ${m.gradient}`} />

          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 flex-wrap" aria-label="Fil d'Ariane">
              <Link href="/" className="hover:text-gray-700 transition-colors">Accueil</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/outils" className="hover:text-gray-700 transition-colors">Outils</Link>
              <ChevronRight className="w-3 h-3" />
              {cat && <Link href={categoryUrl} className="hover:text-gray-700 transition-colors">{cat}</Link>}
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-700 font-medium">{tool.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="flex-1">
                <div className="flex items-start gap-5 mb-6">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{
                      border: `2px solid rgba(${m.border},0.2)`,
                      boxShadow: `0 8px 28px rgba(${m.border},0.15), 0 2px 8px rgba(0,0,0,0.08)`,
                    }}
                  >
                    {tool.logo ? (
                      <img src={tool.logo} alt={`Logo ${tool.name}`} width={96} height={96} decoding="async" className="w-full h-full object-contain p-2.5"
                        onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML=`<span style="font-size:36px">${m.icon}</span>`; }} />
                    ) : <span style={{ fontSize: '36px' }}>{m.icon}</span>}
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tool.verified && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ color:'#059669', background:'#ecfdf5', border:'1px solid #a7f3d0' }}>
                          <Check className="w-3 h-3" /> Vérifié
                        </span>
                      )}
                      {tool.trial && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ color:'#0369a1', background:'#e0f2fe', border:'1px solid #bae6fd' }}>
                          <Zap className="w-3 h-3" /> Essai gratuit
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">{heroTitle}</h1>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-3">{heroIntro}</p>

                    {tool.rating && (
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Stars val={tool.rating.value} size={4} />
                        <span className="text-sm font-bold" style={{ color: m.accent }}>{tool.rating.value}/5</span>
                        <span className="text-xs text-gray-400">({tool.rating.count} avis)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {(tool.categories || []).map((c, i) => (
                    <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ color: m.softText, background: m.softBg, border: `1px solid rgba(${m.border},0.2)` }}>
                      {c}
                    </span>
                  ))}
                  {(tool.tags || []).slice(0, 3).map((t, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full text-gray-500 bg-gray-100 border border-gray-200">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={url} target="_blank" rel="sponsored nofollow noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${m.accent}ee, ${m.accent})`,
                      boxShadow: `0 6px 20px rgba(${m.border},0.35)`,
                    }}>
                    Visiter {tool.name} <ExternalLink className="w-4 h-4" />
                  </a>
                  {relatedTools?.length > 0 && (
                    <a href="#compare" className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-800 bg-white border border-gray-200 hover:border-purple-300 transition-all duration-200">
                      <Scale className="w-4 h-4" /> Comparer avec d'autres
                    </a>
                  )}
                </div>
              </div>

              <div
                className="w-full lg:w-64 xl:w-72 flex-shrink-0 rounded-2xl p-5 sm:p-6"
                style={{
                  background: 'white',
                  border: `1px solid rgba(${m.border},0.15)`,
                  boxShadow: `0 4px 20px rgba(${m.border},0.1), 0 1px 4px rgba(0,0,0,0.06)`,
                }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tarif</h3>
                {tool.price && (
                  <div className="text-xl font-bold mb-1" style={{ color: m.accent }}>{tool.price}</div>
                )}
                {tool.priceMonthly && (
                  <div className="text-xs text-gray-400 mb-4">à partir de {tool.priceMonthly} {tool.priceCurrency || '€'}/mois</div>
                )}
                <div className="space-y-2 mb-5">
                  {tool.trial && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Essai gratuit disponible
                    </div>
                  )}
                  {tool.languages?.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /> {tool.languages.slice(0,4).join(', ').toUpperCase()}
                    </div>
                  )}
                  {tool.partner && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Shield className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" /> {tool.partner}
                    </div>
                  )}
                </div>
                <a href={url} target="_blank" rel="sponsored nofollow noopener noreferrer"
                  className="block w-full text-center text-white text-xs font-bold py-3 rounded-xl transition-all duration-200"
                  style={{ background: `linear-gradient(135deg, ${m.accent}dd, ${m.accent})`, boxShadow: `0 4px 12px rgba(${m.border},0.28)` }}>
                  Accéder au site officiel ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">
              {pageLinks.length > 0 && (
                <div className="bg-white rounded-2xl p-5 sm:p-6" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Sur cette page</p>
                  <div className="flex flex-wrap gap-2">
                    {pageLinks.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="text-xs sm:text-sm font-medium px-3 py-2 rounded-xl text-gray-600 bg-gray-50 border border-gray-200 hover:border-purple-300 hover:text-purple-700 transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {tool.description && (
                <section id={`a-propos-${slugify(tool.name)}`} className="bg-white rounded-2xl p-6 sm:p-8 scroll-mt-28" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">À propos de {tool.name}</h2>
                  <div className="text-gray-500 text-sm leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(tool.description) }} />
                </section>
              )}

              {contentSections.map((section, index) => (
                <section
                  key={`${section.title}-${index}`}
                  id={slugify(section.title)}
                  className="bg-white rounded-2xl p-6 sm:p-8 scroll-mt-28"
                  style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h2>

                  {section.lead && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 font-medium">{section.lead}</p>
                  )}

                  {section.paragraphs?.map((paragraph, paragraphIndex) => (
                    <p
                      key={paragraphIndex}
                      className={`text-gray-500 text-sm leading-relaxed ${paragraphIndex !== section.paragraphs.length - 1 || section.subSections?.length || section.bullets?.length ? 'mb-4' : ''}`}
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(paragraph) }}
                    />
                  ))}

                  {section.subSections?.length > 0 && (
                    <div className="space-y-5 mt-5">
                      {section.subSections.map((subSection, subIndex) => (
                        <div key={subIndex}>
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{subSection.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(subSection.text) }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {section.bullets?.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                      {section.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {((tool.strengths?.length > 0) || (tool.limitations?.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tool.strengths?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6" style={{ border: '1px solid #d1fae5', boxShadow: '0 1px 4px rgba(16,185,129,0.06)' }}>
                      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                        Points forts
                      </h3>
                      <ul className="space-y-2.5">
                        {tool.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-500 text-xs leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tool.limitations?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6" style={{ border: '1px solid #fecdd3', boxShadow: '0 1px 4px rgba(239,68,68,0.06)' }}>
                      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                          <X className="w-3.5 h-3.5 text-rose-500" />
                        </span>
                        Points faibles
                      </h3>
                      <ul className="space-y-2.5">
                        {tool.limitations.map((l, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <X className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-500 text-xs leading-relaxed">{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {((tool.idealFor?.length > 0) || (notForList.length > 0)) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tool.idealFor?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6" style={{ border: `1px solid rgba(${m.border},0.15)`, boxShadow: `0 1px 4px rgba(${m.border},0.06)` }}>
                      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                          style={{ background: m.softBg, border: `1px solid rgba(${m.border},0.2)` }}>
                          ✅
                        </span>
                        Idéal pour
                      </h3>
                      <ul className="space-y-2">
                        {tool.idealFor.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-xs font-bold mt-0.5" style={{ color: m.accent }}>→</span>
                            <span className="text-gray-500 text-xs leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {notForList.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6" style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-base">🚫</span>
                        Pas idéal pour
                      </h3>
                      <ul className="space-y-2">
                        {notForList.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-xs font-bold text-gray-300 mt-0.5">—</span>
                            <span className="text-gray-400 text-xs leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {alternatives.length > 0 && (
                <div id="alternatives" className="bg-white rounded-2xl p-6 sm:p-8 scroll-mt-28" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Alternatives et comparaisons utiles</h2>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {alternatives.map((item, i) => (
                      <Link
                        key={`${item.href}-${i}`}
                        href={normalizeInternalHref(item.href)}
                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                      >
                        <p className="text-sm font-semibold text-gray-900 mb-1">{item.title}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {tool.verdict && (
                <div id="notre-verdict" className="bg-white rounded-2xl p-6 sm:p-8 relative overflow-hidden scroll-mt-28"
                  style={{ border: `1px solid rgba(${m.border},0.18)`, boxShadow: `0 4px 16px rgba(${m.border},0.08)` }}>
                  <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                    style={{ background: `linear-gradient(180deg, ${m.accent}, ${m.accent}88)` }} />
                  <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: m.accent }}>
                    <Award className="w-4 h-4" /> Notre verdict
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(tool.verdict) }} />
                </div>
              )}

              {tool.faq?.length > 0 && (
                <div id="questions-frequentes" className="bg-white rounded-2xl p-6 sm:p-8 scroll-mt-28" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Questions fréquentes</h2>
                  <div className="space-y-2">
                    {tool.faq.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
                  </div>
                </div>
              )}

              {/* ── Articles liés (liens internes SEO) ── */}
              {tool.readMore?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">À lire aussi</h2>
                  <div className="space-y-3">
                    {tool.readMore.map((item, i) => (
                      <a key={i} href={normalizeInternalHref(item.href)} className="flex items-start gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors group">
                        <span className="text-purple-600 font-bold text-lg leading-none mt-0.5">→</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">{item.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {tool.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tool.tags.map((t, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-lg text-gray-400 bg-gray-100 border border-gray-200 hover:text-gray-600 transition-colors cursor-default">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div
                className="rounded-2xl p-5 sm:p-6"
                style={{ background: 'white', border: `1px solid rgba(${m.border},0.15)`, boxShadow: `0 4px 20px rgba(${m.border},0.08)` }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Accès direct</h3>
                <a href={url} target="_blank" rel="sponsored nofollow noopener noreferrer"
                  className="block w-full text-center text-white text-sm font-bold py-3.5 rounded-xl mb-3 transition-all duration-200"
                  style={{ background: `linear-gradient(135deg, ${m.accent}dd, ${m.accent})`, boxShadow: `0 4px 14px rgba(${m.border},0.3)` }}>
                  Visiter {tool.name} ↗
                </a>

                <div className="space-y-3 pt-3 border-t border-gray-50">
                  {tool.rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Note</span>
                      <div className="flex items-center gap-1.5">
                        <Stars val={tool.rating.value} size={3} />
                        <span className="text-xs font-bold" style={{ color: m.accent }}>{tool.rating.value}</span>
                      </div>
                    </div>
                  )}
                  {tool.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Prix</span>
                      <span className="text-xs font-semibold text-gray-700">{tool.price}</span>
                    </div>
                  )}
                  {tool.trial !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Essai</span>
                      <span className={`text-xs font-bold ${tool.trial ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {tool.trial ? '✓ Gratuit' : 'Non disponible'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {relatedTools.length > 0 && (
                <div id="compare" className="bg-white rounded-2xl p-5 sm:p-6 scroll-mt-28" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Comparer avec</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {relatedTools.slice(0, 6).map(option => (
                      <button
                        key={option.id}
                        onClick={() => setCompareId(option.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${compareId === option.id ? 'text-white shadow-sm' : 'bg-white text-gray-700 hover:border-purple-300'}`}
                        style={compareId === option.id ? { background: `linear-gradient(135deg, ${m.accent}ee, ${m.accent})`, borderColor: 'transparent' } : { borderColor: '#e5e7eb' }}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>

                  {compareTool && (
                    <>
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-stretch mb-4">
                        <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Actuel</p>
                          <p className="font-bold text-gray-900">{tool.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{tool.short || tool.highlight}</p>
                        </div>
                        <div className="flex items-center justify-center text-gray-300 font-bold text-xs">VS</div>
                        <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Comparé</p>
                          <p className="font-bold text-gray-900">{compareTool.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{compareTool.short || compareTool.highlight}</p>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-2xl border border-gray-200">
                        <table className="w-full text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left px-3 py-3 text-gray-500 font-semibold">Critère</th>
                              <th className="text-left px-3 py-3 text-gray-900 font-bold">{tool.name}</th>
                              <th className="text-left px-3 py-3 text-gray-900 font-bold">{compareTool.name}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparisonRows.map((row, index) => (
                              <tr key={row.label} className={index !== comparisonRows.length - 1 ? 'border-b border-gray-100' : ''}>
                                <td className="px-3 py-3 text-gray-500 font-medium">{row.label}</td>
                                <td className="px-3 py-3 text-gray-800">{row.left}</td>
                                <td className="px-3 py-3 text-gray-800">{row.right}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                          <p className="text-sm font-bold text-gray-900 mb-2">Pourquoi choisir {tool.name}</p>
                          <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                            {(tool.strengthShort || tool.strengths || []).slice(0, 3).map((item, i) => (
                              <li key={i} className="flex items-start gap-2"><Plus className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" /> <span>{item}</span></li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                          <p className="text-sm font-bold text-gray-900 mb-2">Pourquoi choisir {compareTool.name}</p>
                          <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                            {(compareTool.strengthShort || compareTool.strengths || []).slice(0, 3).map((item, i) => (
                              <li key={i} className="flex items-start gap-2"><Plus className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" /> <span>{item}</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link href={`/tool/${compareTool.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:underline">
                          Voir la fiche de {compareTool.name}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
