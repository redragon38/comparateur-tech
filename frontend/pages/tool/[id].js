import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Star, Check, X, ChevronDown, ChevronRight, Zap, Shield, Globe, Award } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ToolCard from '../../components/ToolCard';
import SEO from '../../components/SEO';

const CAT_META = {
  'VPN':                       { icon: '🛡️', gradient: 'from-blue-500 to-cyan-400',    accent: '#3b82f6', softBg: '#eff6ff', softText: '#1d4ed8', glow: 'rgba(59,130,246,0.18)',  border: '59,130,246'  },
  'Intelligence artificielle': { icon: '🤖', gradient: 'from-violet-500 to-purple-400', accent: '#7c3aed', softBg: '#f5f3ff', softText: '#5b21b6', glow: 'rgba(139,92,246,0.18)', border: '139,92,246' },
  'Hébergement web':           { icon: '🌐', gradient: 'from-emerald-500 to-teal-400',  accent: '#059669', softBg: '#ecfdf5', softText: '#065f46', glow: 'rgba(16,185,129,0.18)', border: '16,185,129' },
  'Antivirus':                 { icon: '🦠', gradient: 'from-rose-500 to-orange-400',   accent: '#dc2626', softBg: '#fff1f2', softText: '#9f1239', glow: 'rgba(239,68,68,0.18)',  border: '239,68,68'  },
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
  return text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
}

export default function ToolPage() {
  const router = useRouter();
  const { id } = router.query;
  const [tool, setTool] = useState(null);
  const [alts, setAlts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch('/data/tools.json')
        .then(r => r.json())
        .then(data => {
          const found = data.find(t => t.id === id);
          setTool(found);
          if (found) {
            setAlts(data.filter(t => t.id !== found.id && t.categories?.some(c => found.categories?.includes(c))).slice(0, 3));
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        <p className="text-gray-400 text-sm">Chargement…</p>
      </div>
    </div>
  );

  if (!tool) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Outil non trouvé</h1>
        <Link href="/outils" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold" style={{ background: '#7c3aed' }}>
          <ArrowLeft className="w-4 h-4" /> Voir tous les outils
        </Link>
      </div>
      <Footer />
    </div>
  );

  const cat = tool.categories?.[0];
  const m = CAT_META[cat] || DEFAULT;
  const url = tool.affiliateUrl || tool.website || '#';

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${tool.name} – Avis, Prix & Alternatives | Comparateur-Tech`}
        description={tool.short || `Découvrez notre avis sur ${tool.name} : fonctionnalités, prix, points forts et alternatives.`}
        canonical={`https://comparateur-tech.com/tool/${tool.id}`}
      />
      <Header />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-white border-b border-gray-100">
          {/* Gradient de fond */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 800px 500px at 70% -100px, ${m.glow}, transparent)` }} />
          <div className={`h-[3px] w-full bg-gradient-to-r ${m.gradient}`} />

          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 flex-wrap">
              <Link href="/" className="hover:text-gray-700 transition-colors">Accueil</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/outils" className="hover:text-gray-700 transition-colors">Outils</Link>
              <ChevronRight className="w-3 h-3" />
              {cat && <Link href={`/outils/${cat.toLowerCase().replace(/ /g,'-').replace(/é/g,'e').replace(/è/g,'e')}`} className="hover:text-gray-700 transition-colors">{cat}</Link>}
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-700 font-medium">{tool.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              {/* Infos principales */}
              <div className="flex-1">
                <div className="flex items-start gap-5 mb-6">
                  {/* Logo */}
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{
                      border: `2px solid rgba(${m.border},0.2)`,
                      boxShadow: `0 8px 28px rgba(${m.border},0.15), 0 2px 8px rgba(0,0,0,0.08)`,
                    }}
                  >
                    {tool.logo ? (
                      <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain p-2.5"
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
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">{tool.name}</h1>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-3">{tool.short || tool.highlight}</p>

                    {tool.rating && (
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Stars val={tool.rating.value} size={4} />
                        <span className="text-sm font-bold" style={{ color: m.accent }}>{tool.rating.value}/5</span>
                        <span className="text-xs text-gray-400">({tool.rating.count} avis)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags catégories */}
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

                {/* CTA principal */}
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${m.accent}ee, ${m.accent})`,
                    boxShadow: `0 6px 20px rgba(${m.border},0.35)`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 10px 28px rgba(${m.border},0.5)`; e.currentTarget.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow=`0 6px 20px rgba(${m.border},0.35)`; e.currentTarget.style.transform=''; }}>
                  Visiter {tool.name} <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Carte prix — sidebar hero */}
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
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center text-white text-xs font-bold py-3 rounded-xl transition-all duration-200"
                  style={{ background: `linear-gradient(135deg, ${m.accent}dd, ${m.accent})`, boxShadow: `0 4px 12px rgba(${m.border},0.28)` }}
                  onMouseEnter={e => { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform=''; }}>
                  Accéder au site officiel ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENU PRINCIPAL ── */}
        <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">

              {/* Description */}
              {tool.description && (
                <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">À propos de {tool.name}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(tool.description) }} />
                </div>
              )}

              {/* Points forts / faibles */}
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

              {/* Idéal pour / Pas pour */}
              {((tool.idealFor?.length > 0) || (tool.notFor?.length > 0)) && (
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
                  {tool.notFor?.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6" style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-base">🚫</span>
                        Pas pour
                      </h3>
                      <ul className="space-y-2">
                        {tool.notFor.map((s, i) => (
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

              {/* Verdict */}
              {tool.verdict && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 relative overflow-hidden"
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

              {/* FAQ */}
              {tool.faq?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Questions fréquentes</h2>
                  <div className="space-y-2">
                    {tool.faq.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} />)}
                  </div>
                </div>
              )}

              {/* Tags */}
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
            <div className="space-y-5">
              {/* CTA sticky */}
              <div
                className="rounded-2xl p-5 sm:p-6 sticky top-24"
                style={{ background: 'white', border: `1px solid rgba(${m.border},0.15)`, boxShadow: `0 4px 20px rgba(${m.border},0.08)` }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Accès direct</h3>
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center text-white text-sm font-bold py-3.5 rounded-xl mb-3 transition-all duration-200"
                  style={{ background: `linear-gradient(135deg, ${m.accent}dd, ${m.accent})`, boxShadow: `0 4px 14px rgba(${m.border},0.3)` }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 8px 22px rgba(${m.border},0.45)`; e.currentTarget.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow=`0 4px 14px rgba(${m.border},0.3)`; e.currentTarget.style.transform=''; }}>
                  Visiter {tool.name} ↗
                </a>

                {/* Stats rapides */}
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

              {/* Alternatives */}
              {alts.length > 0 && (
                <div className="bg-white rounded-2xl p-5 sm:p-6" style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Alternatives</h3>
                  <div className="space-y-3">
                    {alts.map(alt => (
                      <ToolCard key={alt.id} tool={alt} />
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
  );
}
